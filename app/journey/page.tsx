"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Modal from './components/Modal'
import Module from './components/ModuleBox';
import Content from './components/ContentBox';
import ChooseModule from './components/ChooseModule';
import OptionsModal from "./components/OptionsModal";
import YouTubeEmbed from "./components/YoutubeEmbed";
import './journey_style.css';
import getTotalVideoLength from "@/public/scripts/videoDetails";

interface Module {
    moduleName: string;
    details: string;
    content: string[];
    url: string[];
    nextModule: string;
    options: string[];
}

const modules = [
    {
        moduleName: "Module1",
        details: "This is Module1",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "Module2",
        options: ["Option1", "Option2", "Option3", "Option4"],
    },
    {
        moduleName: "Module2",
        details: "This is Module2",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "Module3",
        options: ["Option1", "Option2", "Option3", "Option4"],
    },
    {
        moduleName: "Module3",
        details: "This is Module3",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "Module1",
        options: ["Option1", "Option2", "Option3", "Option4"],
    },
    {
        moduleName: "Option1",
        details: "This is Option1",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "Option2",
        options: [],
    },
    {
        moduleName: "Option2",
        details: "This is Option2",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "Option3",
        options: [],
    },
    {
        moduleName: "Option3",
        details: "This is Option3",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "",
        options: [],
    },
    {
        moduleName: "Option4",
        details: "This is Option4",
        content: ["Content1", "Content2", "Content3"],
        url: [],
        nextModule: "",
        options: [],
    }
]

class Node<T> {
    value: T;
    next: Node<T> | null = null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList<T> {
    head: Node<T> | null = null;

    constructor(initialValue: T | null = null) {
        this.head = initialValue !== null ? new Node(initialValue) : null;
    }

    add(value: T) {
        const newNode = new Node(value);
        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }
}

async function fetchData() {
    let modules = [];

    try {
        const datasetResponse = await fetch("/api/read-csv?filename=data.csv");
        const datasetData = await datasetResponse.json();
        const datasetCsvData = datasetData;

        const outputResponse = await fetch("/api/read-csv?filename=output.csv");
        const outputData = await outputResponse.json();
        const outputCsvData = outputData;

        const resourceObjs = outputCsvData.map((output: any) => {
            return datasetCsvData.find((obj: any) => obj.title === output.title);
        });

        let j = 0;
        let currentModule = "";
        for (let i = 0; i < resourceObjs.length; i++) {
            const obj = resourceObjs[i];
            if (obj.topic !== currentModule) {
                currentModule = obj.topic;
                const newObj = { moduleName: obj.topic, details: "", content: [obj.title], url: [obj.url], nextModule: "", options: [] };
                if (j > 0) {
                    modules[j - 1].nextModule = newObj.moduleName;
                }
                modules[j++] = newObj;
            } else {
                modules[j - 1].content.push(obj.title);
                modules[j - 1].url.push(obj.url);
            }
        }
    } catch (err) {
        console.error('Error fetching CSV data:', err);
    }

    return modules;
}

interface VideoProgress {
    [videoId: string]: number;
}

const Journey = () => {
    const [newModules, setModules] = useState<{ moduleName: string; details: string; content: string[]; url: string[]; nextModule: string; options: string[]; }[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailState, setDetails] = useState('');
    const [visibleStates, setVisibleStates] = useState<{ [key: string]: boolean }>({});
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
    const [optionsState, setOptionsState] = useState<any[]>([]);
    const [nextModuleState, setNextModuleState] = useState('');
    const [currentModuleState, setCurrentModuleState] = useState('');
    const [currentClickedModule, setCurrentClickedModule] = useState('');
    const [currentContentName, setCurrentContentName] = useState('Content Name');
    const [learnState, setLearnState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [renderedModules, setRenderedModules] = useState<LinkedList<Module>>(() => new LinkedList());
    const [contentState, setContentState] = useState('');
    const [totalLength, setTotalLength] = useState(0);
    const [videoProgress, setVideoProgress] = useState<VideoProgress>({});
    const [totalWatchTime, setTotalWatchTime] = useState(0);
    const [progressValue, setProgressValue] = useState(0);


    const lastModuleRef = useRef(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        async function loadModules() {
            setIsLoading(true);
            try {
                const modulesData = await fetchData();
                if (modulesData && modulesData.length > 0) {
                    setModules(modulesData);
                } else {
                    setModules(modules);
                }
            } catch (error) {
                console.error("Error fetching modules:", error);
                setModules(modules);
            } finally {
                setIsLoading(false);
            }
        }

        loadModules();
    }, []);

    useEffect(() => {
        if (!isLoading && newModules.length > 0) {
            setRenderedModules(() => {
                const newList = new LinkedList<Module>();
                newList.add(newModules[0]);
                return newList;
            });
            setCurrentModuleState(newModules[0].moduleName);
        }
    }, [isLoading, newModules]);

    const start = (moduleName: string) => {
        setVisibleStates((prevStates) => ({
            ...prevStates,
            [moduleName]: true
        }));
        setTimeout(() => {
            document.getElementById(moduleName)?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 700);
    };

    const details = (details: string) => {
        setDetails(details || "Python ZERO TO HERO");
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const closeOptions = () => {
        setIsModalVisible(false);
        setIsOptionsModalVisible(false);
    };

    const closeLearnBoard = () => {
        setLearnState(false);
    };

    const choose = (options: any[], nextModule: string, currentModule: string) => {
        setOptionsState(options);
        setCurrentModuleState(currentModule);
        setNextModuleState(nextModule);
        setIsOptionsModalVisible(true);
    };

    const moduleSelectHandle = (selectedModule: any) => {
        closeOptions();
        setRenderedModules(prevModules => {
            const newModules = new LinkedList<any>();
            let current = prevModules.head;

            while (current && (current.value as Module).moduleName !== currentModuleState) {
                newModules.add(current.value);
                current = current.next;
            }

            if (current) {
                newModules.add(current.value);
            }

            newModules.add(selectedModule);
            return newModules;
        });

        setVisibleStates(prevStates => ({
            ...prevStates,
            [selectedModule.moduleName]: false
        }));

        setCurrentModuleState(selectedModule.moduleName);

        lastModuleRef.current = selectedModule.moduleName;
    };


    const learn = (url: string, content: string, moduleName: string) => {
        setContentState(url);
        setCurrentClickedModule(moduleName);
        setCurrentContentName(content);
        setLearnState(true);
    }

    const handleTimeUpdate = useCallback((videoId: string | null, time: number) => {
        if (videoId) {
            setVideoProgress(prev => {
                const newProgress = { ...prev, [videoId]: time };
                const newTotal = Object.values(newProgress).reduce((sum, curr) => sum + curr, 0);
                setTotalWatchTime(newTotal);
                return newProgress;
            });
        }
    }, []);

    const getCurrentVideoId = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('v') || urlObj.pathname.slice(1);
        } catch (error) {
            console.error('Invalid URL:', url);
            return null;
        }
    };

    const currentVideoId = getCurrentVideoId(contentState);
    const currentVideoProgress = currentVideoId ? videoProgress[currentVideoId] || 0 : 0;

    const renderModules = (module: Module) => (
        <div key={module.moduleName} id={module.moduleName} className="flex flex-col items-center relative pathway">
            {visibleStates[module.moduleName] && (
                <div className={`container-content flex flex-col-reverse items-center ${visibleStates[module.moduleName] ? 'visible' : ''}`}>
                    {module.content.map((title: string, i: number) => (
                        <Content key={i} title={title} learn={() => learn(module.url[i], module.content[i], module.moduleName)} />
                    ))}
                    {(module.options.length !== 0 || module.nextModule !== "") && <ChooseModule choose={() => choose(module.options, module.nextModule, module.moduleName)} />}
                </div>
            )}
            <Module
                name={module.moduleName}
                select={false}
                start={() => start(module.moduleName)}
                details={() => details(module.details)}
                selectHandle={() => { }}
            />
        </div>
    );


    useEffect(() => {
        const span = document.querySelector(".close") as HTMLElement;
        const spanOption = document.querySelector(".closeOption") as HTMLElement;
        const spanLearnBoard = document.querySelector(".closeLearnBoard") as HTMLElement;
        if (span) {
            span.onclick = closeModal;
        }
        if (spanOption) {
            spanOption.onclick = closeOptions;
        }
        if (spanLearnBoard) {
            spanLearnBoard.onclick = closeLearnBoard;
        }
        return () => {
            if (span) {
                span.onclick = null;
            }
            if (spanOption) {
                spanOption.onclick = null;
            }
            if (spanLearnBoard) {
                spanLearnBoard.onclick = null;
            }
        };
    }, [isModalVisible, isOptionsModalVisible, learnState]);

    useEffect(() => {
        if (lastModuleRef.current) {
            const lastModule = document.getElementById(lastModuleRef.current);
            if (lastModule) {
                lastModule.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            lastModuleRef.current = null;
        }
    }, [renderedModules]);

    useEffect(() => {
        if (newModules.length > 0) {
            const moduleObj = newModules.find((obj) => (obj.moduleName === currentModuleState));
            getTotalVideoLength(moduleObj?.url).then((totalLength) => { setTotalLength(totalLength) });
        }
    }, [currentModuleState]);

    useEffect(() => {
        const value = Math.round((totalWatchTime / totalLength) * 100);
        setProgressValue(value)
    }, [totalWatchTime]);


    return (
        <div className="journey-container" style={{ height: '100vh', overflow: 'hidden' }}>
            {isOptionsModalVisible && (<div className="h-full w-full fixed z-10 glass">
                <OptionsModal
                    options={optionsState}
                    nextModule={nextModuleState}
                    modules={newModules}
                    start={start}
                    details={details}
                    selectHandle={moduleSelectHandle}
                />
            </div>
            )}
            {isModalVisible && <div className="h-full w-full fixed z-10 glass">
                <Modal details={detailState} />
            </div>}
            <div className="flex relative h-full">
                <div id="module-container" className={`flex-grow overflow-y-auto h-full py-8   ${learnState ? "move" : ""}`} >
                    <div className="flex flex-col-reverse items-center justify-center overflow-x-hidden relative w-full min-h-full" style={{ overflowY: 'auto' }}>
                        {renderedModules.toArray().map(renderModules)}
                    </div>
                </div>
                <div className={`flex flex-col h-screen bg-zinc-600 learn-board ${learnState ? "move" : ""}`}>
                    {learnState && <header className="bg-zinc-800 p-4">
                        <span className="text-white float-right text-4xl font-bold hover:text-red-700 hover:no-underline hover:cursor-pointer focus:text-red-700 focus:no-underline focus:cursor-pointer closeLearnBoard">
                            &times;
                        </span>
                        <h1 className="text-2xl font-bold text-white">{currentContentName}</h1>
                        <p className="text-sm text-white">{currentClickedModule} &gt; {currentContentName}</p>
                    </header>}
                    {learnState && <div className="glass shadow-xl rounded-2xl w-fill my-6 mx-4 relative h-full">
                        <div className="flex flex-col justify-center items-center h-full overflow-hidden w-full">
                            <YouTubeEmbed videoUrl={contentState} onTimeUpdate={handleTimeUpdate} initialWatchTime={currentVideoProgress} />
                        </div>
                    </div>}
                    {learnState && <footer className="bg-zinc-800 p-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full w-1/3" style={{ width: `${progressValue ? progressValue : 0}%` }}></div>
                        </div>
                        <p className="text-sm text-white mt-2">Progress: {progressValue ? progressValue : 0} %</p>
                    </footer>}
                </div>
            </div>
        </div>
    );
};

export default Journey;