import React, { useState, useEffect } from 'react';
import elementsData from './data/elements.json';
import recipesData from './data/recipes.json';
import { GameHeader } from './components/GameHeader';
import { ElementShop } from './components/ElementShop';
import { Laboratory } from './components/Laboratory';
import { CompoundInventory } from './components/CompoundInventory';
import { Encyclopedia } from './components/Encyclopedia';
import { Modal } from './components/Modal';
import { MessageNotification } from './components/MessageNotification';

const ChemistryGame = () => {

  const elementData = elementsData;
  const recipes = recipesData;

  const [money, setMoney] = useState(50);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [elements, setElements] = useState({
    H: 10,
    O: 5,
    C: 3,
    N: 2
  });
  const [compounds, setCompounds] = useState({});
  const [discovered, setDiscovered] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showLab, setShowLab] = useState(true);
  const [autoProduction, setAutoProduction] = useState({});
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);

  const experienceToNextLevel = level * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setElements(prev => {
        const newElements = { ...prev };
        Object.keys(autoProduction).forEach(element => {
          if (autoProduction[element] > 0) {
            newElements[element] = (newElements[element] || 0) + autoProduction[element];
          }
        });
        return newElements;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoProduction]);

  const openElementModal = (elementSymbol) => {
    setModalData(elementData[elementSymbol]);
    setModalType('element');
  };

  const openCompoundModal = (compoundSymbol) => {
    const recipe = recipes.find(r => r.symbol === compoundSymbol);
    setModalData(recipe);
    setModalType('compound');
  };

  const closeModal = () => {
    setModalData(null);
    setModalType(null);
  };

  const buyElement = (element) => {
    const elementInfo = elementData[element];
    if (elementInfo.unlockLevel > level) {
      showMessage(`레벨 ${elementInfo.unlockLevel}에 잠금 해제됩니다!`, 'error');
      return;
    }

    const price = elementInfo.price;
    if (money >= price) {
      setMoney(money - price);
      setElements(prev => ({
        ...prev,
        [element]: (prev[element] || 0) + 1
      }));
      showMessage(`${elementInfo.name} 구매 완료!`, 'success');
    } else {
      showMessage('돈이 부족합니다!', 'error');
    }
  };

  const selectElement = (element) => {
    if (elements[element] > 0) {
      setSelectedElements([...selectedElements, element]);
      setElements(prev => ({
        ...prev,
        [element]: prev[element] - 1
      }));
    }
  };

  const clearSelection = () => {
    const returned = {};
    selectedElements.forEach(elem => {
      returned[elem] = (returned[elem] || 0) + 1;
    });
    setElements(prev => {
      const newElements = { ...prev };
      Object.keys(returned).forEach(elem => {
        newElements[elem] = (newElements[elem] || 0) + returned[elem];
      });
      return newElements;
    });
    setSelectedElements([]);
  };

  const combineElements = () => {
    if (selectedElements.length === 0) {
      showMessage('원소를 선택해주세요!', 'error');
      return;
    }

    const sorted = [...selectedElements].sort();
    const recipe = recipes.find(r => {
      const recipeSorted = [...r.formula].sort();
      return JSON.stringify(recipeSorted) === JSON.stringify(sorted);
    });

    if (recipe) {
      const compoundKey = recipe.symbol;
      setCompounds(prev => ({
        ...prev,
        [compoundKey]: (prev[compoundKey] || 0) + 1
      }));

      const expGain = recipe.value;
      setExperience(prev => {
        const newExp = prev + expGain;
        if (newExp >= experienceToNextLevel) {
          setLevel(prevLevel => prevLevel + 1);
          showMessage(`🎉 레벨 업! 레벨 ${level + 1}이 되었습니다!`, 'discovery');
          return newExp - experienceToNextLevel;
        }
        return newExp;
      });

      if (!discovered.includes(recipe.symbol)) {
        setDiscovered([...discovered, recipe.symbol]);
        showMessage(`🎉 새로운 발견! ${recipe.name}(${recipe.symbol}) +${expGain}EXP`, 'discovery');
      } else {
        showMessage(`${recipe.name} 제조 완료! +${expGain}EXP`, 'success');
      }
      setSelectedElements([]);
    } else {
      showMessage('잘못된 조합입니다! 다시 시도하세요.', 'error');
      clearSelection();
    }
  };

  const sellCompound = (compoundSymbol) => {
    const recipe = recipes.find(r => r.symbol === compoundSymbol);
    if (compounds[compoundSymbol] > 0 && recipe) {
      setCompounds(prev => ({
        ...prev,
        [compoundSymbol]: prev[compoundSymbol] - 1
      }));
      setMoney(money + recipe.value);
      showMessage(`${recipe.name} 판매! +${recipe.value}원`, 'success');
    }
  };

  const buyAutoProducer = (element) => {
    const cost = elementData[element].price * 10;
    if (money >= cost) {
      setMoney(money - cost);
      setAutoProduction(prev => ({
        ...prev,
        [element]: (prev[element] || 0) + 1
      }));
      showMessage(`${elementData[element].name} 자동 생산기 구매!`, 'success');
    } else {
      showMessage('돈이 부족합니다!', 'error');
    }
  };

  const showMessage = (text, type) => {
    const newMessage = {
      id: Date.now(),
      text,
      type
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 3000);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex flex-col">
      <MessageNotification messages={messages} />

      <Modal
        modalData={modalData}
        modalType={modalType}
        closeModal={closeModal}
      />

      <div className="max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
        <GameHeader
          money={money}
          discovered={discovered}
          level={level}
          experience={experience}
          experienceToNextLevel={experienceToNextLevel}
          showLab={showLab}
          setShowLab={setShowLab}
        />

        {showLab ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
            <ElementShop
              elements={elements}
              level={level}
              autoProduction={autoProduction}
              buyElement={buyElement}
              buyAutoProducer={buyAutoProducer}
              openElementModal={openElementModal}
            />

            <Laboratory
              elements={elements}
              selectedElements={selectedElements}
              selectElement={selectElement}
              combineElements={combineElements}
              clearSelection={clearSelection}
            />

            <CompoundInventory
              compounds={compounds}
              sellCompound={sellCompound}
              openCompoundModal={openCompoundModal}
            />
          </div>
        ) : (
          <Encyclopedia
            discovered={discovered}
            openCompoundModal={openCompoundModal}
          />
        )}
      </div>
    </div>
  );
};

export default ChemistryGame;