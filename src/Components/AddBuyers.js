import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBuyers.css'

function AddBuyers({ buyers, setBuyers}) {
    const [inRange, setInRange] = useState(true);
    const [showAdd, setShowAdd] = useState(true);
    const navigate = useNavigate();


    function handleAddBuyer() {
        if (buyers.length <= 10) {
            setInRange(true)
            setBuyers([...buyers, { id: Date.now(), name: '' }]);
        }
        else {
            setInRange(false)
            setBuyers([...buyers, { id: Date.now(), name: '' }]);
            setShowAdd(false);
            console.log('out of range')
        }
    }

    function handleRemoveBuyer(indexToRemove) {
        setInRange(true)
        setShowAdd(true);
        setBuyers(buyers.filter((_, index) => index !== indexToRemove));
    }

    function handleNameChange(index, newName) {
        const updatedBuyers = buyers.map((buyer, i) => {
            if (i === index) {
                return { ...buyer, name: newName };
            }
            return buyer;
        });
        setBuyers(updatedBuyers);
    }

    function handleBackButton() {
        navigate('/');
    }

    function handleDoneButton() {
        navigate('/result');
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
                            <input
                                type="text"
                                className="name-input"
                                placeholder={`buyer #${index + 1}`}
                                value={buyer.name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                            />
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
                {buyers.length >= 2 && 
                    <button className="done-btn btn" onClick={handleDoneButton}>done</button>
                }    
            </div>
            
        </div>
    );
}

export default AddBuyers;