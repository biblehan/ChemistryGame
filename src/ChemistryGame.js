import React, { useState, useEffect } from 'react';
import { TrendingUp, Book, Sparkles } from 'lucide-react';

// ============================================
// 데이터 파일 분리 영역 시작
// ============================================
// 실제 프로젝트에서는 이 부분을 별도 파일로 분리할 수 있습니다.
// 예시: src/data/elements.json, src/data/recipes.json 생성 후
// 파일 상단에서 불러와서 사용하세요

// 원소 데이터
// 나중에 파일로 분리 가능: src/data/elements.json
const elementData = {
  H: { name: '수소', color: '#FF6B6B', price: 1 },
  O: { name: '산소', color: '#4ECDC4', price: 2 },
  C: { name: '탄소', color: '#45B7D1', price: 3 },
  N: { name: '질소', color: '#A8E6CF', price: 4 },
  S: { name: '황', color: '#FFD93D', price: 10 },
  P: { name: '인', color: '#FFA07A', price: 15 },
  Cl: { name: '염소', color: '#98D8C8', price: 20 },
  Na: { name: '나트륨', color: '#F7DC6F', price: 25 }
  // 새로운 원소를 추가하려면 여기에 추가하세요
  // 예: Fe: { name: '철', color: '#B7410E', price: 30 }
};

// 화합물 레시피 데이터
// 나중에 파일로 분리 시: src/data/recipes.json
const recipes = [
  { 
    formula: ['H', 'H', 'O'], 
    name: '물', 
    symbol: 'H₂O', 
    value: 10, 
    emoji: '💧' 
  },
  { 
    formula: ['C', 'O', 'O'], 
    name: '이산화탄소', 
    symbol: 'CO₂', 
    value: 15, 
    emoji: '☁️' 
  },
  { 
    formula: ['N', 'H', 'H', 'H'], 
    name: '암모니아', 
    symbol: 'NH₃', 
    value: 20, 
    emoji: '💨' 
  },
  { 
    formula: ['H', 'H', 'O', 'O'], 
    name: '과산화수소', 
    symbol: 'H₂O₂', 
    value: 25, 
    emoji: '🧪' 
  },
  { 
    formula: ['C', 'H', 'H', 'H', 'H'], 
    name: '메테인', 
    symbol: 'CH₄', 
    value: 30, 
    emoji: '🔥' 
  },
  { 
    formula: ['N', 'N', 'O'], 
    name: '아산화질소', 
    symbol: 'N₂O', 
    value: 35, 
    emoji: '😄' 
  },
  { 
    formula: ['C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'], 
    name: '에테인', 
    symbol: 'C₂H₆', 
    value: 50, 
    emoji: '⚗️' 
  },
  { 
    formula: ['S', 'O', 'O'], 
    name: '이산화황', 
    symbol: 'SO₂', 
    value: 40, 
    emoji: '🌫️' 
  },
  { 
    formula: ['Na', 'Cl'], 
    name: '소금', 
    symbol: 'NaCl', 
    value: 60, 
    emoji: '🧂' 
  },
  { 
    formula: ['H', 'Cl'], 
    name: '염산', 
    symbol: 'HCl', 
    value: 45, 
    emoji: '⚠️' 
  },
  { 
    formula: ['P', 'H', 'H', 'H'], 
    name: '포스핀', 
    symbol: 'PH₃', 
    value: 55, 
    emoji: '💀' 
  },
  { 
    formula: ['C', 'O'], 
    name: '일산화탄소', 
    symbol: 'CO', 
    value: 12, 
    emoji: '☠️' 
  }
  // 새로운 화합물을 추가하려면 여기에 추가하세요
  // 예: { formula: ['H', 'H', 'S'], name: '황화수소', symbol: 'H₂S', value: 35, emoji: '🥚' }
];

// ============================================
// 데이터 파일 분리 영역 끝
// ============================================
// 실제 프로젝트에서 JSON 파일로 분리하는 방법:
// 
// 1. src/data/elements.json 파일 생성하여 elementData 내용 복사
// 2. src/data/recipes.json 파일 생성하여 recipes 내용 복사
// 3. 파일 상단에서 JSON 파일을 불러오기
// 4. 위의 const elementData 와 const recipes 선언 부분을 삭제
// ============================================

const ChemistryGame = () => {
  const [money, setMoney] = useState(50);
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
  const [autoProduction, setAutoProduction] = useState({
    H: 0,
    O: 0,
    C: 0,
    N: 0
  });

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

  const buyElement = (element) => {
    const price = elementData[element].price;
    if (money >= price) {
      setMoney(money - price);
      setElements(prev => ({
        ...prev,
        [element]: (prev[element] || 0) + 1
      }));
      showMessage(`${elementData[element].name} 구매 완료!`, 'success');
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
      
      if (!discovered.includes(recipe.symbol)) {
        setDiscovered([...discovered, recipe.symbol]);
        showMessage(`🎉 새로운 발견! ${recipe.name}(${recipe.symbol})`, 'discovery');
      } else {
        showMessage(`${recipe.name} 제조 완료!`, 'success');
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
        [element]: prev[element] + 1
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
            className={`text-lg font-bold p-4 rounded-xl shadow-2xl ${
              message.type === 'success' ? 'bg-green-500' :
              message.type === 'discovery' ? 'bg-purple-500 animate-pulse' :
              'bg-red-500'
            } text-white transition-all duration-300`}
          >
            {message.text}
          </div>
        ))}
      </div>
      
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

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowLab(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                showLab ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/60'
              }`}
            >
              🧪 실험실
            </button>
            <button
              onClick={() => setShowLab(false)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                !showLab ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/60'
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
              <div className="space-y-2">
                {Object.keys(elementData).map(element => (
                  <div key={element} className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: elementData[element].color }}
                        >
                          {element}
                        </div>
                        <div>
                          <p className="font-bold text-white">{elementData[element].name}</p>
                          <p className="text-sm text-white/70">보유: {elements[element] || 0}개</p>
                        </div>
                      </div>
                      <button
                        onClick={() => buyElement(element)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                      >
                        {elementData[element].price}원
                      </button>
                    </div>
                    {autoProduction[element] > 0 && (
                      <p className="text-xs text-green-300">⚡ 자동 생산: +{autoProduction[element]}/3초</p>
                    )}
                    <button
                      onClick={() => buyAutoProducer(element)}
                      className="w-full bg-purple-500/50 hover:bg-purple-600/70 text-white px-2 py-1 rounded text-xs font-bold mt-1 transition-all"
                    >
                      자동 생산기 ({elementData[element].price * 10}원)
                    </button>
                  </div>
                ))}
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
                        <div>
                          <p className="text-3xl mb-1">{recipe.emoji}</p>
                          <p className="font-bold text-white text-lg">{recipe.name}</p>
                          <p className="text-sm text-white/70">{recipe.symbol}</p>
                          <p className="text-xs text-green-300 mt-1">보유: {compounds[compoundKey]}개</p>
                        </div>
                        <button
                          onClick={() => sellCompound(compoundKey)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                        >
                          판매<br/>{recipe.value}원
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
                    className={`rounded-xl p-4 transition-all ${
                      isDiscovered
                        ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-yellow-400'
                        : 'bg-white/5 border-2 border-white/10'
                    }`}
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
