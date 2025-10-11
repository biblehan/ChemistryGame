import React from 'react';
import elementsData from '../data/elements.json';

export const Laboratory = ({
    elements,
    selectedElements,
    selectElement,
    combineElements,
    clearSelection
}) => {
    const elementData = elementsData;
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col h-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-white">🧪 실험 공간</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-white font-bold mb-3">선택된 원소:</p>
                    <div className="relative">
                        <div className="flex flex-wrap gap-2 h-32 overflow-y-auto content-start p-1">
                            {selectedElements.map((elem, idx) => (
                                <div
                                    key={idx}
                                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-xs flex-shrink-0"
                                    style={{ backgroundColor: elementData[elem].color }}
                                >
                                    {elem}
                                </div>
                            ))}
                        </div>
                        {selectedElements.length > 16 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/30 to-transparent pointer-events-none flex items-end justify-center pb-1">
                                <span className="text-xs text-white/70">↓</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-white font-bold mb-3">보유 원소 클릭:</p>
                    <div className="relative">
                        <div className="flex flex-wrap gap-2 h-32 overflow-y-auto content-start p-1">
                            {Object.keys(elements).filter(e => elements[e] > 0).map(elem => (
                                <div key={elem} className="relative flex-shrink-0">
                                    <button
                                        onClick={() => selectElement(elem)}
                                        className="hover:scale-110 transition-transform block"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-xs"
                                            style={{ backgroundColor: elementData[elem].color }}
                                        >
                                            {elem}
                                        </div>
                                    </button>
                                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold pointer-events-none">
                                        {elements[elem]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {Object.keys(elements).filter(e => elements[e] > 0).length > 12 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/30 to-transparent pointer-events-none flex items-end justify-center pb-1">
                                <span className="text-xs text-white/70">↓</span>
                            </div>
                        )}
                    </div>
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
    );
};
