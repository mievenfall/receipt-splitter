import React, { useState, useEffect, useCallback } from 'react';
import './TextRecognition.css'
import Checkbox from "./Checkbox";
import { useNavigate } from 'react-router-dom';

const PickItems = ({items, buyers}) => {
    const navigate = useNavigate();
    function handleBackButton() {
        navigate('/');
    }
    return (
        // <div>hello</div>
        <div className="text-recognition-container">
          <div className="back-container">
                <button className="back-btn btn" onClick={handleBackButton}>&lt; back</button>
          </div>
          <div className="result-title">pick item for😊⬇️</div>
          <div className="results-container">
            {/* <div className="recognized-text">
              <h3>Recognized Text:</h3>
              <pre>{recognizedText}</pre>
            </div> */}
            
            <div className="parsed-info">
              {/* <h3>Parsed Information:</h3> */}
              <div className="receipt-details">
                    <div className="items-list">
                      {items.map((item, index) =>  (
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
            </div>
          </div>
        </div>
    )
}

export default PickItems;