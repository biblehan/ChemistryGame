import React from 'react';
import { Info } from 'lucide-react';
import recipesData from '../data/recipes.json';

export const CompoundInventory = ({ compounds, sellCompound, openCompoundModal }) => {
    const recipes = recipesData;
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border border-white/20 flex flex-col h-full overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 text-white text-center flex-shrink-0 lg:block hidden">📦 화합물</h2>
            <div className="space-y-2 overflow-y-auto flex-1">
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
    );
};
