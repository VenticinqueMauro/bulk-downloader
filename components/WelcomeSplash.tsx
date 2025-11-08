
import React from 'react';
import { SearchIcon, CheckCircleIcon } from './icons';

export const WelcomeSplash: React.FC = () => {
    return (
        <div className="flex flex-grow justify-center items-center p-4">
            <div className="p-8 mx-auto max-w-2xl text-center rounded-2xl border bg-gray-800/50 border-gray-700/50 sm:p-12">
                <h2 className="mb-2 text-3xl font-bold text-white">Welcome to FileHarvest</h2>
                <p className="mb-8 text-lg text-gray-400">
                    The smartest way to download files from any webpage.
                </p>
                <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
                    <div className="flex gap-4 items-start p-4 rounded-lg bg-gray-900/50">
                        <div className="p-2 mt-1 rounded-full bg-sky-500/10">
                            <SearchIcon className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Scan Any Page</h3>
                            <p className="text-sm text-gray-400">Paste a URL above and let AI find all downloadable files.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 rounded-lg bg-gray-900/50">
                        <div className="p-2 mt-1 rounded-full bg-sky-500/10">
                            <CheckCircleIcon className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Select & Download</h3>
                            <p className="text-sm text-gray-400">Easily filter, select, and download the files you need, individually or in bulk.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
