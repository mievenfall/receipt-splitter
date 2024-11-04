import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from "./Checkbox";
import "./PickItemsPage.css";

const PickItemsPage = ({ items, setItems, buyers }) => {
  const navigate = useNavigate();
  const [currentBuyerIndex, setCurrentBuyerIndex] = useState(0);
  // Create a map to store selected items for each buyer
  const [buyerSelections, setBuyerSelections] = useState(
    buyers.reduce((acc, buyer) => ({
      ...acc,
      [buyer.name]: []
    }), {})
  );


  const handleBackButton = () => {
    navigate('/buyers');
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
    
    // Update items state
    setItems(prevItems => 
      prevItems.map(item => 
        item.itemCode === itemCode 
          ? { ...item, buyer: isSelected ? currentBuyer : "" }
          : item
      )
    );

    setBuyerSelections(prevSelections => ({
      ...prevSelections,
      [currentBuyer]: isSelected 
        ? [...prevSelections[currentBuyer], itemCode]
        : prevSelections[currentBuyer].filter(item => item !== itemCode)
    }));
  };

  const currentBuyer = buyers[currentBuyerIndex];
  const currentSelections = buyerSelections[currentBuyer.name] || [];
  console.log(items);

  return (
    <div className="text-recognition-container">
      <div className="back-container">
        <button className="back-btn btn" onClick={handleBackButton}>&lt; back</button>
      </div>

      <div className="result-title">pick items for {currentBuyer.name}😊⬇️</div>

      <div className="results-container">
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
                      isSelected={currentSelections.includes(item.itemCode)}
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
            onClick={handleNext}
            disabled={currentBuyerIndex === buyers.length - 1}
          >
            done
          </button>
        )}
      </div>

      {/* For debugging - you can remove this */}
      <div style={{ padding: '20px', fontSize: '12px', color: '#666' }}>
        Current selections for {currentBuyer.name}: {currentSelections.join(', ')}
      </div>
    </div>
  );
};

export default PickItemsPage;