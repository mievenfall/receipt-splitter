import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from "./Checkbox";
import "./PickItemsPage.css";

const PickItemsPage = ({ items, setItems, buyers, setBuyers }) => {
  const navigate = useNavigate();
  const [currentBuyerIndex, setCurrentBuyerIndex] = useState(0);
  // Initialize buyerSelections based on existing item assignments
  const [buyerSelections, setBuyerSelections] = useState(() => {
    const initialSelections = buyers.reduce((acc, buyer) => ({
      ...acc,
      [buyer.name]: []
    }), {});

    // Populate initial selections based on items' buyer property
    items.forEach(item => {
      if (item.buyer) {
        initialSelections[item.buyer] = [
          ...(initialSelections[item.buyer] || []),
          item.itemCode
        ];
      }
    });

    return initialSelections;
  });

  const handleBackButton = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (currentBuyerIndex < buyers.length - 1) {
      setCurrentBuyerIndex(currentBuyerIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentBuyerIndex > 0) {
      setCurrentBuyerIndex(currentBuyerIndex - 1);
    }
  };

  const handleItemToggle = (itemCode, isSelected, thisItem) => {
    const currentBuyer = buyers[currentBuyerIndex].name;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.itemCode === itemCode 
          ? { ...item, buyer: isSelected ? currentBuyer : "" }
          : item
      )
    );
  
    const newSelections = isSelected 
      ? [...buyerSelections[currentBuyer], itemCode]
      : buyerSelections[currentBuyer].filter(item => item !== itemCode);
  
    setBuyerSelections(prevSelections => ({
      ...prevSelections,
      [currentBuyer]: newSelections
    }));
  };

  const handleDoneButton = () => {
    navigate('/result');
  }

  const currentBuyer = buyers[currentBuyerIndex];
  
  // Determine if an item is selected based on both buyerSelections and item.buyer
  const isItemSelected = (item) => {
    return item.buyer === currentBuyer.name;
  }

  return (
    <div className="pick-items-container">
      <div className="back-container">
        <button className="back-btn btn" onClick={handleBackButton}>&lt; back</button>
      </div>

      <div className="pick-items-title">pick items for {currentBuyer.name}😊⬇️</div>

      <div className="pick-items-field">
        <div className="parsed-info">
          <div className="receipt-details">
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="receipt-item">
                  {item.type === 'regular' ? (
                    <Checkbox 
                      description={item.description}
                      price={item.price.toFixed(2)}
                      itemCode={item.itemCode}
                      isSelected={isItemSelected(item)}
                      onToggle={handleItemToggle}
                      thisItem={item}
                      currentBuyerName={currentBuyer.name}
                    />
                  ) : (
                    <div>
                      {item.quantity} @ ${item.unitPrice.toFixed(2)} ea = ${item.totalPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="navigation-btns">
        {currentBuyerIndex > 0 ? (
          <button
            className="btn prev-btn"
            onClick={handlePrevious}
            disabled={currentBuyerIndex === 0}
          >
            previous
          </button>
        ) : (
          <div className="btn prev-btn"></div>
        )}
        
        <div className="text-center">
          {currentBuyerIndex + 1} of {buyers.length}
        </div>

        {(currentBuyerIndex < buyers.length - 1) ? (
          <button
            className="btn next-btn"
            onClick={handleNext}
            disabled={currentBuyerIndex === buyers.length - 1}
          >
            next
          </button>
        ) : (
          <button
            className="btn done-add-btn"
            onClick={handleDoneButton}
          >
            done
          </button>
        )}
      </div>
    </div>
  );
};

export default PickItemsPage;