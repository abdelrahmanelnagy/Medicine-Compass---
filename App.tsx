
import React, { useState, useCallback, useEffect } from 'react';
import { fetchDrugInformation } from './services/geminiService';
import type { Drug, Region, Language } from './types';
import { Language as LanguageEnum } from './types';
import { Region as RegionEnum } from './types';
import { UI_TEXTS, REGIONS, EXAMPLE_DRUGS } from './constants';
import { DrugDetail } from './components/DrugDetail';
import { GlobeIcon, LanguageIcon, PillIcon } from './components/icons';

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [drugData, setDrugData] = useState<Drug | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<Language>(LanguageEnum.AR);
    const [region, setRegion] = useState<Region>(RegionEnum.US);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

    const T = UI_TEXTS[lang];

    const handleSearch = useCallback(async (query?: string) => {
        const finalQuery = query || searchTerm;
        if (!finalQuery) return;
        
        setLoading(true);
        setError(null);
        setDrugData(null);

        try {
            const data = await fetchDrugInformation(finalQuery, lang, region);
            setDrugData(data);
        } catch (err) {
            setError(T.error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, lang, region, T.error]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };
    
    const handleExampleClick = (drugName: string) => {
        setSearchTerm(drugName);
        handleSearch(drugName);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                         <PillIcon className="w-8 h-8 text-blue-600" />
                         <h1 className="text-2xl font-bold text-gray-800">{T.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <GlobeIcon className="w-5 h-5 text-gray-500"/>
                           <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value as Region)}
                                className="bg-transparent text-gray-700 text-sm font-medium focus:outline-none"
                           >
                               {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                           </select>
                        </div>
                         <div className="flex items-center gap-2">
                           <LanguageIcon className="w-5 h-5 text-gray-500"/>
                           <button 
                             onClick={() => setLang(lang === 'en' ? LanguageEnum.AR : LanguageEnum.EN)} 
                             className="text-gray-700 text-sm font-medium"
                           >
                                {lang === 'en' ? 'العربية' : 'English'}
                           </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 max-w-5xl">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <form onSubmit={handleFormSubmit} className={`flex gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={T.searchPlaceholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : T.searchButton}
                        </button>
                    </form>
                     <div className={`flex flex-wrap gap-2 mt-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        {EXAMPLE_DRUGS[lang].map(drug => (
                            <button key={drug} onClick={() => handleExampleClick(drug)} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
                                {drug}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    {loading && (
                        <div className="text-center p-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">{T.loading}</p>
                        </div>
                    )}
                    {error && <p className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</p>}
                    {!loading && !error && !drugData && (
                         <div className="text-center p-10 text-gray-500">
                            <PillIcon className="w-16 h-16 mx-auto text-gray-300" />
                            <p className="mt-4 text-lg">{T.initialMessage}</p>
                         </div>
                    )}
                    {drugData && <DrugDetail drug={drugData} lang={lang} />}
                </div>
            </main>
            
            <footer className="bg-white text-center p-4 mt-8 border-t">
                <p className="text-xs text-gray-500">{T.disclaimer}</p>
            </footer>
        </div>
    );
};

export default App;
