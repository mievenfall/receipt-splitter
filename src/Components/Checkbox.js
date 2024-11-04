import { useState } from "react";
import "./Checkbox.css"

const Checkbox = ({ description, price, itemCode, isSelected, onToggle, thisItem, currentBuyerName }) => {
  const [isFilled, setIsFilled] = useState(false);
  
  const filled = { backgroundColor: '#3B8A7F' };
  const unfilled = { backgroundColor: "#ffffff" };
  const checkedBoxUnfilled = { border: "none" };
  const checkedBoxFilled = { border: "none" };
  const textFilled = { color: "#ffffff" };
  const textUnfilled = { color: "#0D0D0D" };
  const cannotChoose = {backgroundColor: '#ECF0F2', cursor: 'default'}

  const handleChange = () => {
    const newCheckedState = !isSelected;
    setIsFilled(newCheckedState);
    onToggle(itemCode, newCheckedState, thisItem);
  };
  let content;
  if (thisItem.buyer !== "" && thisItem.buyer !== currentBuyerName) {
    return (
        <div className="checkbox-wrapper" style={cannotChoose}>
          <label className="checkbox-label" style={cannotChoose}>
            <input 
              id={`checkbox-${itemCode}`}
              className={isSelected ? "checked" : ""} 
              type="checkbox" 
              style={checkedBoxUnfilled} 
              checked={isSelected}
            />
            <div className="checkbox-title" style={textUnfilled}>
              <div className="checkbox-description">{description}</div>
              <div className="checkbox-price">${price}</div>      
              <div className="buyerName-container">
                <div className="buyerName">{thisItem.buyer}'s pick!</div>
              </div>
            </div>
          </label>
        </div>
    
    );
  }
  else {
    return (
      <div className="checkbox-wrapper" style={isFilled ? filled : unfilled}>
        <label className="checkbox-label">
          <input 
            id={`checkbox-${itemCode}`}
            className={isSelected ? "checked" : ""} 
            type="checkbox" 
            style={isFilled ? checkedBoxFilled : checkedBoxUnfilled} 
            checked={isSelected}
            onChange={handleChange}
          />
          <div className="checkbox-title" style={isFilled ? textFilled : textUnfilled}>
            <div className="checkbox-description">{description}</div>
            <div className="checkbox-price">${price}</div>      
            <div className="buyerName-container"></div>
          </div>
        </label>
      </div>
    );
  }
  
};

export default Checkbox;