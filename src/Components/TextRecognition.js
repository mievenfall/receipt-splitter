import React, { useState, useEffect, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import './TextRecognition.css'
import Checkbox from "./Checkbox";

const TextRecognition = ({ selectedFile }) => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const preprocessImage = useCallback(async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale up the image significantly for better character definition
        const scale = 3;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw scaled image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Enhanced processing specifically for @ symbol and text
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Enhanced grayscale conversion
          const gray = (0.299 * r + 0.587 * g + 0.114 * b);

          // Adaptive thresholding
          let final;
          if (gray > 180) {
            final = 255; // White
          } else if (gray < 100) {
            final = 0;   // Black
          } else {
            // Enhanced contrast for mid-range values (where @ symbols often are)
            final = gray < 130 ? 0 : 255;
          }

          data[i] = final;
          data[i + 1] = final;
          data[i + 2] = final;
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to blob with maximum quality
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0); // Using PNG for better quality
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

  const postProcessText = useCallback((text) => {
    return text.split('\n').map(line => {
      // Look for patterns like "2 1.25 ea" or "2 $1.25 ea" or variations
      const patterns = [
        // Match price patterns with or without $ symbol
        {
          from: /(\d+)\s*(?:a|@|&|8|B|6|Q|0|O|o)\s*\$?\s*(\d+\.?\d*)\s*(?:ea|EA|Ba|E8|EB|Ed)/i,
          to: (_, quantity, price) => `${quantity} @ $${price} ea`
        },
        // Handle cases where @ is completely missed
        {
          from: /(\d+)\s+\$?\s*(\d+\.?\d*)\s*(?:ea|EA|E8|EB|Ed)/i,
          to: (_, quantity, price) => `${quantity} @ $${price} ea`
        }
      ];

      let processedLine = line;
      patterns.forEach(({ from, to }) => {
        if (from.test(processedLine)) {
          processedLine = processedLine.replace(from, to);
        }
      });

      return processedLine;
    }).join('\n');
  }, []);

  useEffect(() => {
    const recognizeText = async () => {
      if (!selectedFile) return;

      try {
        setIsProcessing(true);
        setError(null);
        setProgress(0);

        const processedImage = await preprocessImage(selectedFile);

        // First pass with default settings
        let result = await Tesseract.recognize(processedImage, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          },
          tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$.,%-:/@&',
          tessedit_pageseg_mode: '6',
          preserve_interword_spaces: '1',
          tessjs_create_hocr: '0',
          tessjs_create_tsv: '0',
          tessjs_create_box: '0',
          tessjs_create_unlv: '0',
          tessjs_create_osd: '0'
        });

        // Post-process the text
        const processedText = postProcessText(result.data.text);
        setRecognizedText(processedText);

      } catch (err) {
        setError('Error processing image: ' + err.message);
        console.error('Tesseract error:', err);
      } finally {
        setIsProcessing(false);
      }
    };

    recognizeText();
  }, [selectedFile, preprocessImage, postProcessText]);

  const parseReceipt = useCallback(() => {
    if (!recognizedText) return null;

    const lines = recognizedText.split('\n');
    const items = [];
    let subtotal = null;
    let tax = new Map();
    let total = null;
    let itemTypes = new Map();

    // Regular expressions for different line patterns
    const patterns = {
      // For regular items with BF (tax code) and price
      regularItem: /(\d+)\s+(.+?)\s+(\w+)\s+\$?(\d+\.\d{2})\s*/,
      // For quantity items (e.g., "2 @ $1.25 ea")
      quantityItem: /(\d+)\s*@\s*\$(\d+\.\d{2})\s*ea/i,
      // For Fee
      fee: /(.+)\s+(FEE)\s+\$?(\d+\.\d{2})\s*/i,
      // For subtotal
      subtotal: /SUBTOTAL\s+\$?(\d+\.\d{2})/i,
      // For tax
      tax: /(\w)\s+\=\s+\w{2}\s+TAX\s+(\d\.\d{1,9})\s+on\s+\$?\d+\.\d{2}\s+\$?\d+\.\d{2}/i,
      // For total
      total: /^TOTAL\s+\$?(\d+\.\d{2})/i
    };

    let prevItem = null;
    lines.forEach(line => {
      // Try matching regular items
      const regularMatch = line.match(patterns.regularItem);
      if (regularMatch) {
        let [_, itemCode, description, taxCode, price] = regularMatch;
        if (taxCode.trim() === "P") {
          const reMatch = description.trim().match(/(.+?)\s+(TF|BF)/);

          if (reMatch) {
            [_, description, taxCode] = reMatch
          }
        }
        let item = {
          type: 'regular',
          itemCode,
          description: description.trim(),
          taxCode: taxCode.trim(),
          price: parseFloat(price),
          finalPrice: parseFloat(price)
        }
        items.push(item);
        prevItem = item
        if (itemTypes.has(taxCode.trim())) {
          itemTypes.get(taxCode.trim()).push(item);
        }
        else {
          itemTypes.set(taxCode.trim(), [item]);
        }
        return; // Skip to next line
      }

      // Implement feeMatch later

      // const feeMatch = line.match(patterns.fee);
      // if (feeMatch) {
      //   let [_, description, price] = regularMatch;
      //   if (taxCode.trim() === "P") {
          
      //   let item = {
      //     type: 'fee',
      //     description: description.trim(),
      //     price: parseFloat(price),
      //   }
      //   items.push(item);
      //   }
      //   return;
      // }

      // Try matching quantity items
      const quantityMatch = line.match(patterns.quantityItem);
      if (quantityMatch) {
        const [_, quantity, unitPrice] = quantityMatch;
        items.pop();
        prevItem['price'] = parseFloat(unitPrice);
        prevItem['finalPrice'] = parseFloat(unitPrice);
        let i = 0;
        while (i < parseInt(quantity)) {
          items.push(prevItem);
          i++;
        }
        return;
      }


      // Try matching subtotal
      const subtotalMatch = line.match(patterns.subtotal);
      if (subtotalMatch) {
        subtotal = parseFloat(subtotalMatch[1]);
      }

      // Try matching tax
      const taxMatch = line.match(patterns.tax);
      if (taxMatch) {
        const [_, taxCode, taxPercent] = taxMatch;
        if (!tax.has(taxCode.trim())) {
          tax.set(taxCode.trim(), parseFloat(taxPercent))
        }
      }

      // Try matching total
      const totalMatch = line.match(patterns.total);
      if (totalMatch) {
        total = parseFloat(totalMatch[1]);
      }
    });

    tax.entries().forEach(pair => {
      items.forEach(item => {
        if (item['taxCode'][0] === pair[0]) {
          item['finalPrice'] = item['price'] + (item['price'] * parseFloat(pair[1]) /100);
        }
      });
    });
    console.log(recognizedText)

    return { items, subtotal, tax, total };

  }, [recognizedText]);

  return (
    <div className="text-recognition-container">
      {isProcessing ? (
        <div className="processing-status">
          <div>Processing image... {progress}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : recognizedText && (
        <>
          <div className="back-container">
                <button className="back-btn btn">&lt; back</button>
          </div>
          <div className="result-title">pick item for😊⬇️</div>
          <div className="results-container">
            {/* <div className="recognized-text">
              <h3>Recognized Text:</h3>
              <pre>{recognizedText}</pre>
            </div> */}
            
            <div className="parsed-info">
              {/* <h3>Parsed Information:</h3> */}
              {(() => {
                const parsed = parseReceipt();
                return parsed && (
                  <div className="receipt-details">
                    <div className="items-list">
                      {parsed.items.map((item, index) => (
                        <div key={index} className="receipt-item">
                          {item.type === 'regular' ? (
                            <>
                              <Checkbox label={`${item.description} - \$${item.price.toFixed(2)}`} />
                              {/* <div>
                                {item.description} - ${item.price.toFixed(2)}
                              </div> */}
                            </>
                          ) : (
                            <div>
                              {item.quantity} @ ${item.unitPrice.toFixed(2)} ea = ${item.totalPrice.toFixed(2)}
                            </div>
                          )}
                          
                        </div>
                      ))}
                    </div>
                    {/* <div className="receipt-summary">
                      {parsed.subtotal && (
                        <div>Subtotal: ${parsed.subtotal.toFixed(2)}</div>
                      )}
                      {parsed.tax && (
                        <div>Tax: ${parsed.tax.toFixed(2)}</div>
                      )}
                      {parsed.total && (
                        <div className="total">Total: ${parsed.total.toFixed(2)}</div>
                      )}
                    </div> */}
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TextRecognition;