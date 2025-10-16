import React, { useState } from 'react';
import { Info } from 'lucide-react';
import elementsData from '../data/elements.json';

export const ElementShop = ({
    elements,
    level,
    autoProduction,
    buyElement,
    buyAutoProducer,
    openElementModal
}) => {
    const [elementCategory, setElementCategory] = useState('nonmetal');
    const elementData = elementsData;
    const categories = {
        nonmetal: { name: '비금속', icon: '⚡' },
        metal: { name: '금속', icon: '⚙️' },
        transition: { name: '전이금속', icon: '🔩' },
        noble: { name: '비활성기체', icon: '🎈' }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border border-white/20 flex flex-col h-full overflow-hidden">
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(categories).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setElementCategory(cat)}
                        className={`px-2 py-1 rounded-lg font-bold text-xs transition-all ${elementCategory === cat
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/20 text-white/60 hover:bg-white/30'
                            }`}
                    >
                        {categories[cat].icon} {categories[cat].name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-scroll flex-1 hide-scrollbar">
                {Object.keys(elementData)
                    .filter(element => elementData[element].category === elementCategory)
                    .map(element => {
                        const isLocked = elementData[element].unlockLevel > level;
                        return (
                            <div
                                key={element}
                                className={`rounded-xl p-3 ${isLocked ? 'bg-white/5 opacity-50' : 'bg-white/10'
                                    }`}
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                                                } transition-transform`}
                                            style={{ backgroundColor: isLocked ? '#666' : elementData[element].color }}
                                            onClick={() => !isLocked && openElementModal(element)}
                                        >
                                            {isLocked ? '🔒' : element}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <p className="font-bold text-white text-sm truncate">
                                                    {isLocked ? '???' : elementData[element].name}
                                                </p>
                                                {!isLocked && (
                                                    <button
                                                        onClick={() => openElementModal(element)}
                                                        className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                                                    >
                                                        <Info size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            {isLocked ? (
                                                <p className="text-xs text-white/70">
                                                    레벨 {elementData[element].unlockLevel} 필요
                                                </p>
                                            ) : (
                                                <p className="text-xs text-white/70">
                                                    보유: {elements[element] || 0}개
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => buyElement(element)}
                                        disabled={isLocked}
                                        className={`w-full px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${isLocked
                                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                            }`}
                                    >
                                        {isLocked ? '잠김' : `${elementData[element].price}원`}
                                    </button>

                                    {!isLocked && autoProduction[element] > 0 && (
                                        <p className="text-xs text-green-300">
                                            ⚡ 자동 생산: +{autoProduction[element]}/3초
                                        </p>
                                    )}

                                    {!isLocked ? (
                                        <button
                                            onClick={() => buyAutoProducer(element)}
                                            className="w-full bg-purple-500/50 hover:bg-purple-600/70 text-white px-2 py-1 rounded text-xs font-bold transition-all"
                                        >
                                            자동 생산기 ({elementData[element].price * 10}원)
                                        </button>
                                    ) : (
                                        <div className="h-6"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};