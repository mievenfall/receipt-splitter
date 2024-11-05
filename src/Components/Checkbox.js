import "./Checkbox.css"

const Checkbox = ({ description, price, itemCode, isSelected, onToggle, thisItem, currentBuyerName }) => {
  const filled = { backgroundColor: '#3B8A7F' };
  const unfilled = { backgroundColor: "#ffffff" };
  const checkedBoxUnfilled = { border: "none" };
  const checkedBoxFilled = { border: "none" };
  const textFilled = { color: "#ffffff" };
  const textUnfilled = { color: "#0D0D0D" };
  const cannotChoose = {backgroundColor: '#ECF0F2', cursor: 'default'}

  const handleChange = () => {
    const newCheckedState = !isSelected;
    onToggle(itemCode, newCheckedState, thisItem);
  };

  // If item is already selected by another buyer
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

  // Regular selectable item
  return (
    <div className="checkbox-wrapper" style={isSelected ? filled : unfilled}>
      <label className="checkbox-label">
        <input 
          id={`checkbox-${itemCode}`}
          className={isSelected ? "checked" : ""} 
          type="checkbox" 
          style={isSelected ? checkedBoxFilled : checkedBoxUnfilled} 
          checked={isSelected}
          onChange={handleChange}
        />
        <div className="checkbox-title" style={isSelected ? textFilled : textUnfilled}>
          <div className="checkbox-description">{description}</div>
          <div className="checkbox-price">${price}</div>      
          <div className="buyerName-container"></div>
        </div>
      </label>
    </div>
  );
};

export default Checkbox;