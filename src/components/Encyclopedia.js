import React from 'react';
import { Info } from 'lucide-react';
import elementsData from '../data/elements.json';
import recipesData from '../data/recipes.json';

export const Encyclopedia = ({ discovered, openCompoundModal }) => {
    const elementData = elementsData;
    const recipes = recipesData;
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col h-full overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 text-white text-center flex-shrink-0">📖 화합물 도감</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-y-auto flex-1 min-h-0 p-2">
                {[...recipes]
                    .sort((a, b) => {
                        const aDiscovered = discovered.includes(a.symbol);
                        const bDiscovered = discovered.includes(b.symbol);
                        if (aDiscovered && !bDiscovered) return -1;
                        if (!aDiscovered && bDiscovered) return 1;
                        return 0;
                    })
                    .map((recipe, index) => {
                        const isDiscovered = discovered.includes(recipe.symbol);
                        return (
                            <div
                                key={`${recipe.symbol}-${index}`}
                                className={`rounded-xl p-2 transition-all cursor-pointer hover:scale-105 ${isDiscovered
                                    ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-yellow-400'
                                    : 'bg-white/5 border-2 border-white/10'
                                    }`}
                                onClick={() => isDiscovered && openCompoundModal(recipe.symbol)}
                            >
                                <div className="text-center">
                                    <p className="text-3xl mb-1">{isDiscovered ? recipe.emoji : '❓'}</p>
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
                                                        key={elem + idx}
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
    );
};
