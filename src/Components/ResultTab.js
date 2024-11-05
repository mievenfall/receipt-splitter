import { useState } from "react";
import "./ResultTab.css"

const ResultTab = ({ buyerPurchase }) => {
    const active = {display: 'flex'};
    const unactive = {display: 'none'};
    const filled = { backgroundColor: '#3B8A7F' };
    const unfilled = { backgroundColor: "#ffffff" };
    const textFilled = { color: "#ffffff" };
    const textUnfilled = { color: "#0D0D0D" };    
    const [tabOpen, setTabOpen] = useState(false);

    const handleOpenTab = () => {
        setTabOpen(!tabOpen);
    
    };
    return (
        <>
            <div className="result-tab-wrapper" style={tabOpen ? filled : unfilled}>
                <label className="result-tab-label" onClick={handleOpenTab}>
                    <div className="checkbox-placeholder"></div>
                    <div className="result-tab-title" style={tabOpen ? textFilled : textUnfilled}>
                        <div className="result-tab-description">{buyerPurchase.name}</div>
                        <div className="result-tab-price">${buyerPurchase.totalPrice.toFixed(2)}</div>
                        <div className="result-tab-num-items">{buyerPurchase.items.length} item(s)</div>
                    </div>
                </label>
            </div>
            <div className="result-list-items-container" style={tabOpen ? active : unactive}>
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
            
        </>

    );
};

export default ResultTab;