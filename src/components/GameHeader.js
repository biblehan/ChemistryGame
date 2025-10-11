import React from 'react';
import { TrendingUp, Book, Sparkles } from 'lucide-react';
import recipesData from '../data/recipes.json';

export const GameHeader = ({ money, discovered, level, experience, experienceToNextLevel, showLab, setShowLab }) => {
    const recipes = recipesData;
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 mb-4 border border-white/20">
            <h1 className="text-5xl font-bold text-center mb-4 text-white">
                ⚛️ 연금술사의 실험실 ⚛️
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
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

                <div className="lg:col-span-3 grid grid-rows-[2fr_1fr] gap-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-4 text-white flex flex-col justify-center">
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

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setShowLab(true)}
                            className={`rounded-xl font-bold text-lg transition-all ${showLab ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/60'
                                }`}
                        >
                            🧪 실험실
                        </button>
                        <button
                            onClick={() => setShowLab(false)}
                            className={`rounded-xl font-bold text-lg transition-all ${!showLab ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/60'
                                }`}
                        >
                            <Sparkles className="inline mr-2" />
                            도감
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
