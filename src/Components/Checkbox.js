import { useState } from "react";
import "./Checkbox.css"

const Checkbox = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const filled = {backgroundColor: '#3B8A7F'}
  const unfilled = {backgroundColor: "#ECF0F2"}
  const checkedBoxUnfilled = {border: "0.15em solid #8e8e8e"}
  const checkedBoxFilled = {border: "none"}
  const textFilled = {color: "#ffffff"}
  const textUnfilled = {color: "#0D0D0D"}


  return (
    <div className="checkbox-wrapper" style={isFilled ? filled : unfilled}>
      {/* <div className={isFilled ? "filled" : ""}> */}
        <label class="checkbox-label">
          <input id="check-box" className={isChecked ? "checked" : ""} type="checkbox" style={isFilled ? checkedBoxFilled : checkedBoxUnfilled} checked={isChecked} onChange={() => {setIsChecked((prev) => !prev); setIsFilled((prev) => !prev)}}/>
          <div className="checkbox-title" style={isFilled ? textFilled : textUnfilled}>{props.label}</div>
        </label>
      {/* </div> */}
    </div>
  );
};
export default Checkbox;