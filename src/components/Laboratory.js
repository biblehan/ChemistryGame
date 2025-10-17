import React from 'react';
import '../App.css';
import elementsData from '../data/elements.json';

export const Laboratory = ({
    elements,
    setElements,
    selectedElements,
    setSelectedElements,
    selectElement,
    combineElements,
    clearSelection
}) => {
    const elementData = elementsData;

    // 선택된 원소들을 카운트
    const selectedCount = selectedElements.reduce((acc, elem) => {
        acc[elem] = (acc[elem] || 0) + 1;
        return acc;
    }, {});

    // 선택된 원소 클릭 시 제거
    const unselectElement = (elem) => {
        const index = selectedElements.indexOf(elem);
        if (index > -1) {
            const newSelected = [...selectedElements];
            newSelected.splice(index, 1);
            setSelectedElements(newSelected);
            setElements(prev => ({
                ...prev,
                [elem]: (prev[elem] || 0) + 1
            }));
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border border-white/20 flex flex-col h-full overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 text-white text-center flex-shrink-0 lg:block hidden">🧪 실험 공간</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
                <div className="bg-white/20 rounded-xl p-2 sm:p-4">
                    <p className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">선택된 원소:</p>
                    <div className="grid grid-cols-4 gap-2 auto-rows-min">
                        {Object.keys(selectedCount).map((elem) => (
                            <div key={elem} className="relative flex justify-center">
                                <button
                                    onClick={() => unselectElement(elem)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-sm"
                                        style={{ backgroundColor: elementData[elem].color }}
                                    >
                                        {elem}
                                    </div>
                                </button>
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold pointer-events-none">
                                    {selectedCount[elem]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/20 rounded-xl p-2 sm:p-4">
                    <p className="text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">보유 원소 클릭:</p>
                    <div className="grid grid-cols-4 gap-2 auto-rows-min">
                        {Object.keys(elements).filter(e => elements[e] > 0).map(elem => (
                            <div key={elem} className="relative flex justify-center">
                                <button
                                    onClick={() => selectElement(elem)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-sm"
                                        style={{ backgroundColor: elementData[elem].color }}
                                    >
                                        {elem}
                                    </div>
                                </button>
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold pointer-events-none">
                                    {elements[elem]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={combineElements}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105"
                >
                    🧪 조합하기
                </button>
                <button
                    onClick={clearSelection}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base"
                >
                    취소
                </button>
            </div>
        </div>
    );
};