import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBuyers.css';

function AddBuyers({ buyers, setBuyers }) {
    const [inRange, setInRange] = useState(true);
    const [showAdd, setShowAdd] = useState(true);
    const [nameError, setNameError] = useState({});
    const navigate = useNavigate();

    const isAllNamesFilled = buyers.length >= 2 && 
        buyers.every(buyer => buyer.name.trim() !== '') &&
        Object.keys(nameError).length === 0;

    function handleAddBuyer() {
        if (buyers.length <= 8) {
            setInRange(true);
            setBuyers([...buyers, { id: Date.now(), name: ''}]);
        } else {
            setInRange(false);
            setBuyers([...buyers, { id: Date.now(), name: ''}]);
            setShowAdd(false);
        }
    }

    function handleRemoveBuyer(indexToRemove) {
        setInRange(true);
        setShowAdd(true);
        
        // Clear any error associated with the removed buyer
        const newNameError = { ...nameError };
        delete newNameError[indexToRemove];
        setNameError(newNameError);
        
        setBuyers(buyers.filter((_, index) => index !== indexToRemove));
    }

    function handleNameChange(index, newName) {
        const updatedBuyers = buyers.map((buyer, i) => {
            if (i === index) {
                return { ...buyer, name: newName };
            }
            return buyer;
        });

        // Clear error if input is empty
        const newNameError = { ...nameError };
        if (newName.trim() === '') {
            delete newNameError[index];
            setNameError(newNameError);
            setBuyers(updatedBuyers);
            return;
        }

        // Check for duplicate names
        const isDuplicate = updatedBuyers.some(
            (buyer, i) => 
                i !== index && 
                buyer.name.trim().toLowerCase() === newName.trim().toLowerCase()
        );

        // Update error state
        if (isDuplicate) {
            newNameError[index] = 'this name already exists';
        } else {
            delete newNameError[index];
        }
        setNameError(newNameError);

        setBuyers(updatedBuyers);
    }


    function handleBackButton() {
        navigate('/');
    }

    function handleDoneButton() {
        navigate('/items');
    }
    
    return (
        <div className="add-buyer-container">
            <div className="back-container">
                <button className="back-btn btn" onClick={handleBackButton}>&lt; back</button>
            </div>
            <div className="add-buyer-title">add buyers here😊⬇️</div>
            <div className="add-buyer-space">
                <div className="buyer-info">
                    {buyers.map((buyer, index) => (
                        <div key={buyer.id} className="buyer-row">
                            <div className="input-error-container">
                                <input
                                    type="text"
                                    className={`name-input ${nameError[index] ? 'input-error' : ''}`}
                                    placeholder={`buyer #${index + 1}`}
                                    value={buyer.name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                />
                                {nameError[index] && (
                                    <div className="error-message">
                                        {nameError[index]}
                                    </div>
                                )}
                            </div>
                            <button 
                                className="remove-btn btn" 
                                onClick={() => handleRemoveBuyer(index)}
                            >
                                remove
                            </button>
                        </div>
                    ))}
                </div>
                {showAdd && 
                    <div className="add-buyer-field">
                        <button className="add-btn btn" onClick={handleAddBuyer}>
                            add buyer
                        </button>
                    </div>
                }
                {!inRange && 
                    <div className="out-of-range">why so many people in one receipt? 🤨</div>
                }
            </div>
            <div className="done-container">
                <button 
                    className={`done-btn btn ${!isAllNamesFilled ? 'btn-disabled' : ''}`}
                    onClick={handleDoneButton}
                    disabled={!isAllNamesFilled}
                >
                    done
                </button>
            </div>
        </div>
    );
}

export default AddBuyers;