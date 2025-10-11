import React, { useState, useEffect } from 'react';
import { TrendingUp, Book, Sparkles, X, Info } from 'lucide-react';
import elementsData from './elements.json';
import recipesData from './recipes.json';
// 원소 데이터
const elementData = elementsData;

// 화합물 레시피 데이터
const recipes = recipesData;

const ChemistryGame = () => {
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
  const [elementCategory, setElementCategory] = useState('nonmetal');

  const categories = {
    nonmetal: { name: '비금속', icon: '⚡' },
    metal: { name: '금속', icon: '⚙️' },
    transition: { name: '전이금속', icon: '🔩' },
    noble: { name: '비활성기체', icon: '🎈' }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`text-lg font-bold p-4 rounded-xl shadow-2xl ${message.type === 'success' ? 'bg-green-500' :
              message.type === 'discovery' ? 'bg-purple-500 animate-pulse' :
                'bg-red-500'
              } text-white transition-all duration-300`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={32} />
            </button>

            {modalType === 'element' ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-lg"
                    style={{ backgroundColor: modalData.color }}
                  >
                    {modalData.symbol}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800">{modalData.name}</h2>
                    <p className="text-xl text-gray-600">원자 번호: {modalData.atomicNumber}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">📝 설명</h3>
                    <p className="text-gray-600 leading-relaxed">{modalData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">🔬 주요 용도</h3>
                    <div className="flex flex-wrap gap-2">
                      {modalData.uses.map((use, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl">
                    <p className="text-lg font-bold text-gray-800">💰 구매 가격: {modalData.price}원</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-7xl">{modalData.emoji}</div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800">{modalData.name}</h2>
                    <p className="text-2xl text-gray-600">{modalData.symbol}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">📝 설명</h3>
                    <p className="text-gray-600 leading-relaxed">{modalData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">⚗️ 필요한 원소</h3>
                    <div className="flex flex-wrap gap-2">
                      {modalData.formula.map((elem, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-lg text-white font-bold text-lg shadow-lg"
                          style={{ backgroundColor: elementData[elem].color }}
                        >
                          {elem} - {elementData[elem].name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">🔬 성질</h3>
                    <p className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold">
                      {modalData.properties}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">💼 주요 용도</h3>
                    <div className="flex flex-wrap gap-2">
                      {modalData.uses.map((use, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-xl">
                    <p className="text-lg font-bold text-gray-800">💰 판매 가격: {modalData.value}원</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 mb-4 border border-white/20">
          <h1 className="text-5xl font-bold text-center mb-4 text-white">
            ⚛️ 연금술사의 실험실 ⚛️
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={28} />
                <span className="text-xl font-bold">보유 자금</span>
              </div>
              <p className="text-4xl font-bold">{money}원</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Book size={28} />
                <span className="text-xl font-bold">발견한 화합물</span>
              </div>
              <p className="text-4xl font-bold">{discovered.length}/{recipes.length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-4 mb-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold">⭐ 레벨 {level}</span>
              <span className="text-sm">{experience}/{experienceToNextLevel} EXP</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-300"
                style={{ width: `${(experience / experienceToNextLevel) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowLab(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${showLab ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/60'
                }`}
            >
              🧪 실험실
            </button>
            <button
              onClick={() => setShowLab(false)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${!showLab ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/60'
                }`}
            >
              <Sparkles className="inline mr-2" />
              도감
            </button>
          </div>
        </div>

        {showLab ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 text-white">⚛️ 원소 상점</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(categories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setElementCategory(cat)}
                    className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${elementCategory === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-white/60 hover:bg-white/30'
                      }`}
                  >
                    {categories[cat].icon} {categories[cat].name}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {Object.keys(elementData)
                  .filter(element => elementData[element].category === elementCategory)
                  .map(element => {
                    const isLocked = elementData[element].unlockLevel > level;
                    return (
                      <div
                        key={element}
                        className={`rounded-xl p-3 ${isLocked
                          ? 'bg-white/5 opacity-50'
                          : 'bg-white/10'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                                } transition-transform relative`}
                              style={{ backgroundColor: isLocked ? '#666' : elementData[element].color }}
                              onClick={() => !isLocked && openElementModal(element)}
                            >
                              {isLocked ? '🔒' : element}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-bold text-white">
                                  {isLocked ? '???' : elementData[element].name}
                                </p>
                                {!isLocked && (
                                  <button
                                    onClick={() => openElementModal(element)}
                                    className="text-white/70 hover:text-white transition-colors"
                                  >
                                    <Info size={16} />
                                  </button>
                                )}
                              </div>
                              {isLocked ? (
                                <p className="text-sm text-white/70">
                                  레벨 {elementData[element].unlockLevel} 필요
                                </p>
                              ) : (
                                <p className="text-sm text-white/70">
                                  보유: {elements[element] || 0}개
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => buyElement(element)}
                            disabled={isLocked}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${isLocked
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                          >
                            {isLocked ? '잠김' : `${elementData[element].price}원`}
                          </button>
                        </div>
                        {!isLocked && autoProduction[element] > 0 && (
                          <p className="text-xs text-green-300">
                            ⚡ 자동 생산: +{autoProduction[element]}/3초
                          </p>
                        )}
                        {!isLocked && (
                          <button
                            onClick={() => buyAutoProducer(element)}
                            className="w-full bg-purple-500/50 hover:bg-purple-600/70 text-white px-2 py-1 rounded text-xs font-bold mt-1 transition-all"
                          >
                            자동 생산기 ({elementData[element].price * 10}원)
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 text-white">🧪 실험 공간</h2>

              <div className="bg-white/20 rounded-xl p-4 mb-4 min-h-32">
                <p className="text-white font-bold mb-3">선택된 원소:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedElements.map((elem, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
                      style={{ backgroundColor: elementData[elem].color }}
                    >
                      {elem}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/20 rounded-xl p-4 mb-4">
                <p className="text-white font-bold mb-3">보유 원소 클릭:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(elements).filter(e => elements[e] > 0).map(elem => (
                    <button
                      key={elem}
                      onClick={() => selectElement(elem)}
                      className="relative hover:scale-110 transition-transform"
                    >
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
                        style={{ backgroundColor: elementData[elem].color }}
                      >
                        {elem}
                      </div>
                      <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {elements[elem]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={combineElements}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
                >
                  🧪 조합하기
                </button>
                <button
                  onClick={clearSelection}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold transition-all"
                >
                  취소
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 text-white">💎 보유 화합물</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {Object.keys(compounds).filter(c => compounds[c] > 0).map(compoundKey => {
                  const recipe = recipes.find(r => r.symbol === compoundKey);
                  return (
                    <div key={compoundKey} className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-3xl">{recipe.emoji}</p>
                            <button
                              onClick={() => openCompoundModal(compoundKey)}
                              className="text-white/70 hover:text-white transition-colors"
                            >
                              <Info size={20} />
                            </button>
                          </div>
                          <p className="font-bold text-white text-lg">{recipe.name}</p>
                          <p className="text-sm text-white/70">{recipe.symbol}</p>
                          <p className="text-xs text-green-300 mt-1">보유: {compounds[compoundKey]}개</p>
                        </div>
                        <button
                          onClick={() => sellCompound(compoundKey)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                        >
                          판매<br />{recipe.value}원
                        </button>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(compounds).filter(c => compounds[c] > 0).length === 0 && (
                  <p className="text-white/50 text-center py-8">아직 제조한 화합물이 없습니다</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">📖 화합물 도감</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recipes.map(recipe => {
                const isDiscovered = discovered.includes(recipe.symbol);
                return (
                  <div
                    key={recipe.symbol}
                    className={`rounded-xl p-4 transition-all cursor-pointer hover:scale-105 ${isDiscovered
                      ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-yellow-400'
                      : 'bg-white/5 border-2 border-white/10'
                      }`}
                    onClick={() => isDiscovered && openCompoundModal(recipe.symbol)}
                  >
                    <div className="text-center">
                      <p className="text-5xl mb-3">{isDiscovered ? recipe.emoji : '❓'}</p>
                      <p className="font-bold text-white text-lg mb-1">
                        {isDiscovered ? recipe.name : '???'}
                      </p>
                      <p className="text-sm text-white/70 mb-2">
                        {isDiscovered ? recipe.symbol : '???'}
                      </p>
                      {isDiscovered && (
                        <>
                          <p className="text-xs text-white/60 mb-1">필요 원소:</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {recipe.formula.map((elem, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded text-white font-bold"
                                style={{ backgroundColor: elementData[elem].color }}
                              >
                                {elem}
                              </span>
                            ))}
                          </div>
                          <p className="text-green-300 font-bold mt-2">가치: {recipe.value}원</p>
                          <div className="mt-2 flex items-center justify-center gap-1 text-white/60">
                            <Info size={14} />
                            <span className="text-xs">클릭하여 상세보기</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemistryGame;