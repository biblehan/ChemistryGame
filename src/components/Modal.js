import React from 'react';
import { X } from 'lucide-react';
import elementsData from '../data/elements.json';

export const Modal = ({ modalData, modalType, closeModal }) => {
    if (!modalData) return null;
    const elementData = elementsData;
    return (
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
    );
};