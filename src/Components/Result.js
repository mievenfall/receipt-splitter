import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Result.css"
import ResultTab from './ResultTab';

const Result = ({buyers, items}) => {
    const navigate = useNavigate();

    const [buyerPurchases, setBuyerPurchases] = useState(
        buyers.map(prevBuyer => (
          prevBuyer, {
            id: prevBuyer.id,
            name: prevBuyer.name,
            items: [],
            totalPrice: 0
          }
        ), {})
    );

    useEffect(() => {
        const updatedBuyerPurchases = buyerPurchases.map(buyerPurchase => {
            const buyerItems = items.filter(item => item.buyer === buyerPurchase.name);
            return {
                ...buyerPurchase,
                items: buyerItems.map(item => item),
                totalPrice: buyerItems.reduce((sum, item) => sum + (item.finalPrice || 0), 0)
            };
        });
        
        setBuyerPurchases(updatedBuyerPurchases);
    }, [items, buyers]);

    const handleBackButton = () => {
        navigate('/items');
      };

    return (
        <div className="result-container">
          <div className="back-container">
            <button className="back-btn btn" onClick={handleBackButton}>&lt; back</button>
          </div>
    
          <div className="result-title">split time!😊</div>
    
          <div className="result-field">
            <div className="parsed-info">
              <div className="result-details">
                <div className="items-list">
                  {buyerPurchases.map((buyerPurchase, index) => (
                    <div key={index} className="result-item">
                        <ResultTab buyerPurchase={buyerPurchase}/>
                        {/* <div className="result-item-row1">
                            <div>{buyerPurchase.name}</div>
                            <div>${buyerPurchase.totalPrice.toFixed(2)}</div>
                        </div>  */}
                        {/* {buyerPurchase.items.map((item, itemIndex) => (
                            <div key={itemIndex}>{item}</div>
                        ))} */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    
          <div className="done-container">
              {/* <button
                className="btn done-result-btn"
              >
                done
              </button> */}
        
          </div>

        </div>
      );
};

export default Result;