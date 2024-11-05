import React, { useState } from "react";
import "./ResultTab.css";

const ResultTab = ({ buyerPurchase }) => {
    const [tabOpen, setTabOpen] = useState(false);

    const handleOpenTab = () => {
        setTabOpen(!tabOpen);
    };

    return (
        <div className="tab-container">
            <div className={`result-tab-wrapper ${tabOpen ? 'active-tab' : ''}`}>
                <label className="result-tab-label" onClick={handleOpenTab}>
                    <div className="checkbox-placeholder"></div>
                    <div className={`result-tab-title ${tabOpen ? 'active-text' : ''}`}>
                        <div className="result-tab-description">{buyerPurchase.name}</div>
                        <div className="result-tab-price">${buyerPurchase.totalPrice.toFixed(2)}</div>
                        <div className="result-tab-num-items">{buyerPurchase.items.length} item(s)</div>
                    </div>
                </label>
            </div>
            <div className={`result-list-items ${tabOpen ? 'open' : ''}`}>
                <div className="result-list-items-container">
                    <div className="checkbox-placeholder"></div>
                    <div className="result-list-items-title">
                        {buyerPurchase.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="result-list-items-item">
                                <div className="result-tab-description">{item.description}</div>
                                <div className="result-tab-price">${item.finalPrice.toFixed(2)}</div>
                                <div className="result-tab-num-items">${item.price.toFixed(2)} --- before tax</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultTab;