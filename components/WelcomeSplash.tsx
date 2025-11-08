
import React from 'react';
import { DownloadCloudIcon, SearchIcon, CheckCircleIcon } from './icons';

export const WelcomeSplash: React.FC = () => {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="text-center bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
                <DownloadCloudIcon className="h-16 w-16 text-sky-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to FileHarvest</h2>
                <p className="text-lg text-gray-400 mb-8">
                    The smartest way to download files from any webpage.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-gray-900/50 p-4 rounded-lg flex items-start gap-4">
                        <div className="p-2 bg-sky-500/10 rounded-full mt-1">
                            <SearchIcon className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Scan Any Page</h3>
                            <p className="text-gray-400 text-sm">Paste a URL above and let AI find all downloadable files.</p>
                        </div>
                    </div>
                     <div className="bg-gray-900/50 p-4 rounded-lg flex items-start gap-4">
                        <div className="p-2 bg-sky-500/10 rounded-full mt-1">
                            <CheckCircleIcon className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Select & Download</h3>
                            <p className="text-gray-400 text-sm">Easily filter, select, and download the files you need, individually or in bulk.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
