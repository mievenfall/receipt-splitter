import React, { useState, useEffect, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import './TextRecognition.css'
import Checkbox from "./Checkbox";
import { useNavigate } from 'react-router-dom';


const TextRecognition = ({ selectedFile, setItems }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


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

  const parseReceipt = useCallback((text) => {
    if (!text) return null;

    const lines = text.split('\n');
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
        if (description.trim() === "VISA") {
          return;
        }
        if (taxCode.trim() === "P") {
          const reMatch = description.trim().match(/(.+?)\s+(TF|BF|N)/);

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
          finalPrice: parseFloat(price),
          buyer: ""
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

      // Try matching quantity items
      const quantityMatch = line.match(patterns.quantityItem);
      if (quantityMatch && prevItem) {
        const [_, quantity, unitPrice] = quantityMatch;
        // Remove the last added item since we'll be adding multiple copies
        items.pop();
        
        // Update the unit price
        const basePrice = parseFloat(unitPrice);
        
        // Add multiple items with indexed itemCodes
        for (let i = 0; i < parseInt(quantity); i++) {
          const newItem = {
            ...prevItem,
            price: basePrice,
            finalPrice: basePrice,
            itemCode: `${prevItem.itemCode}-${i}`
          };
          
          items.push(newItem);
          
          // Update itemTypes map
          if (itemTypes.has(newItem.taxCode.trim())) {
            itemTypes.get(newItem.taxCode.trim()).push(newItem);
          } else {
            itemTypes.set(newItem.taxCode.trim(), [newItem]);
          }
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

    // Apply tax calculations
    for (const [taxCode, taxRate] of tax.entries()) {
      items.forEach(item => {
        if (item.taxCode[0] === taxCode) {
          item.finalPrice = item.price + (item.price * taxRate / 100);
        }
      });
    }

    return { items, subtotal, tax, total };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const recognizeText = async () => {
      if (!selectedFile) return;

      try {
        setIsProcessing(true);
        setError(null);
        setProgress(0);

        const processedImage = await preprocessImage(selectedFile);

        const result = await Tesseract.recognize(processedImage, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text' && isMounted) {
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

        if (!isMounted) return;

        const processedText = postProcessText(result.data.text);
        const parsedData = parseReceipt(processedText);
        
        if (parsedData && parsedData.items) {
          setItems(parsedData.items);
          navigate('/buyers');
        }

      } catch (err) {
        if (isMounted) {
          setError('Error processing image: ' + err.message);
          console.error('Tesseract error:', err);
        }
      } finally {
        if (isMounted) {
          setIsProcessing(false);
        }
      }
    };

    recognizeText();

    return () => {
      isMounted = false;
    };
  }, [selectedFile, preprocessImage, postProcessText, parseReceipt, navigate, setItems]);

  return (
    <div className="text-recognition-container">
      {isProcessing && (
        <div className="processing-status">
          <div>Processing image... {progress}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextRecognition;