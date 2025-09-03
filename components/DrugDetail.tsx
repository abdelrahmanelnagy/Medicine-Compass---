
import React, { ReactNode } from 'react';
import type { Drug } from '../types';
import type { Language } from '../types';
import { UI_TEXTS } from '../constants';
import { WarningIcon, InfoIcon, PillIcon, BookIcon } from './icons';

interface DrugDetailProps {
    drug: Drug;
    lang: Language;
}

const DetailSection: React.FC<{ title: string; icon: ReactNode; children: ReactNode; lang: Language }> = ({ title, icon, children, lang }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className={`flex items-center mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            {icon}
            <h2 className={`text-xl font-bold text-gray-800 ${lang === 'ar' ? 'mr-3' : 'ml-3'}`}>{title}</h2>
        </div>
        <div className="space-y-2 text-gray-700">{children}</div>
    </div>
);

const Pill: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${className}`}>
        {children}
    </span>
);

export const DrugDetail: React.FC<DrugDetailProps> = ({ drug, lang }) => {
    const T = UI_TEXTS[lang];

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className={`flex justify-between items-start ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-700">{drug.generic_name}</h1>
                        <p className="text-gray-500 mt-1">{T.brandNames}: {drug.brand_names.join(', ')}</p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2 rtl:space-x-reverse">
                         <Pill className={drug.availability === 'Rx' ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>{drug.availability}</Pill>
                         <Pill className="bg-gray-100 text-gray-800">{T.notMedicalAdvice}</Pill>
                    </div>
                </div>
                {drug.boxed_warning && (
                    <div className="mt-4 p-4 border-l-4 border-red-600 bg-red-50 rounded-r-lg">
                         <h3 className={`font-bold text-red-800 flex items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <WarningIcon className="w-5 h-5" />
                            <span className={lang === 'ar' ? 'mr-2' : 'ml-2'}>{T.boxedWarning}</span>
                        </h3>
                        <p className="mt-2 text-red-700">{drug.boxed_warning}</p>
                    </div>
                )}
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {drug.mechanism_of_action && <DetailSection title={T.mechanism} icon={<InfoIcon className="w-6 h-6 text-blue-500"/>} lang={lang}><p>{drug.mechanism_of_action}</p></DetailSection>}
                    {drug.indications?.length > 0 && <DetailSection title={T.indications} icon={<PillIcon className="w-6 h-6 text-blue-500"/>} lang={lang}><ul className="list-disc list-inside space-y-1"><li className='list-none'></li>{drug.indications.map((item, i) => <li key={i}>{item}</li>)}</ul></DetailSection>}
                    {drug.dosing_adult?.length > 0 && <DetailSection title={T.dosingAdult} icon={<PillIcon className="w-6 h-6 text-blue-500"/>} lang={lang}><ul className="list-disc list-inside space-y-1"><li className='list-none'></li>{drug.dosing_adult.map((item, i) => <li key={i}>{item}</li>)}</ul></DetailSection>}
                    {drug.dosing_pediatric?.length > 0 && <DetailSection title={T.dosingPediatric} icon={<PillIcon className="w-6 h-6 text-blue-500"/>} lang={lang}><ul className="list-disc list-inside space-y-1"><li className='list-none'></li>{drug.dosing_pediatric.map((item, i) => <li key={i}>{item}</li>)}</ul></DetailSection>}
                    
                    <DetailSection title={T.adverseEffects} icon={<WarningIcon className="w-6 h-6 text-yellow-500"/>} lang={lang}>
                        <h3 className="font-semibold text-gray-700">{T.common}:</h3>
                        <p>{drug.adverse_effects.common.join(', ')}</p>
                        <h3 className="font-semibold text-red-700 mt-4">{T.serious}:</h3>
                        <p>{drug.adverse_effects.serious.join(', ')}</p>
                    </DetailSection>

                    <DetailSection title={T.interactions} icon={<WarningIcon className="w-6 h-6 text-red-500"/>} lang={lang}>
                        {drug.interactions.severe?.length > 0 && <div><Pill className="bg-red-100 text-red-800">{T.severe}</Pill><p className="mt-2">{drug.interactions.severe.join(', ')}</p></div>}
                        {drug.interactions.moderate?.length > 0 && <div><Pill className="bg-yellow-100 text-yellow-800">{T.moderate}</Pill><p className="mt-2">{drug.interactions.moderate.join(', ')}</p></div>}
                        {drug.interactions.minor?.length > 0 && <div><Pill className="bg-green-100 text-green-800">{T.minor}</Pill><p className="mt-2">{drug.interactions.minor.join(', ')}</p></div>}
                    </DetailSection>

                    <DetailSection title={T.alternatives} icon={<PillIcon className="w-6 h-6 text-indigo-500"/>} lang={lang}>
                        <h3 className="font-semibold">{T.genericEquivalents}:</h3>
                        <p>{drug.alternatives.generic_equivalents.join(', ') || 'N/A'}</p>
                        <h3 className="font-semibold mt-4">{T.therapeuticAlternatives}:</h3>
                        <ul className="list-disc list-inside space-y-2"><li className='list-none'></li>
                            {drug.alternatives.therapeutic_alternatives.map((alt, i) => (
                                <li key={i}><strong>{alt.name}</strong>: {alt.difference}</li>
                            ))}
                        </ul>
                    </DetailSection>

                </div>
                <div className="md:col-span-1 space-y-6">
                    {drug.quick_warnings?.length > 0 && 
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <h3 className={`font-bold text-yellow-800 flex items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <WarningIcon className="w-5 h-5"/>
                                <span className={lang === 'ar' ? 'mr-2' : 'ml-2'}>{T.quickWarnings}</span>
                            </h3>
                            <ul className="mt-2 list-disc list-inside text-yellow-700 space-y-1"><li className='list-none'></li>{drug.quick_warnings.map((w,i)=><li key={i}>{w}</li>)}</ul>
                        </div>
                    }
                    <DetailSection title={T.contraindications} icon={<WarningIcon className="w-6 h-6 text-red-500"/>} lang={lang}><ul className="list-disc list-inside space-y-1"><li className='list-none'></li>{drug.contraindications.map((item, i) => <li key={i}>{item}</li>)}</ul></DetailSection>
                    <DetailSection title={T.warnings} icon={<WarningIcon className="w-6 h-6 text-yellow-500"/>} lang={lang}><ul className="list-disc list-inside space-y-1"><li className='list-none'></li>{drug.warnings.map((item, i) => <li key={i}>{item}</li>)}</ul></DetailSection>
                    <DetailSection title={T.pregnancy} icon={<InfoIcon className="w-6 h-6 text-pink-500"/>} lang={lang}><p>{drug.pregnancy_lactation}</p></DetailSection>
                    {drug.renal_hepatic_adjustment && <DetailSection title={T.renalHepatic} icon={<InfoIcon className="w-6 h-6 text-purple-500"/>} lang={lang}><p>{drug.renal_hepatic_adjustment}</p></DetailSection>}
                </div>
            </div>

            <DetailSection title={T.references} icon={<BookIcon className="w-6 h-6 text-gray-500"/>} lang={lang}>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li className='list-none'></li>
                    {drug.references.map((ref, i) => (
                        <li key={i}>{ref.source}{ref.date_accessed ? ` (${ref.date_accessed})` : ''}</li>
                    ))}
                </ul>
            </DetailSection>

        </div>
    );
};
