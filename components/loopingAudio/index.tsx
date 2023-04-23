import { MutableRefObject, useEffect, useState } from "react";

//cutoff is a low pass fulter cutoff
function LoopingAudio(props: { audioFile: string, setVolumeSmoothlyRef: MutableRefObject<((freq: number) => void) | undefined> }) {
    const [audioContext, setAudioContext] = useState<AudioContext>();
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
    const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode>();
    const [volumeNode, setVolumeNode] = useState<GainNode>();
    const [filterNode, setFilterNode] = useState<BiquadFilterNode>();

    useEffect(() => {
        const loadAudio = async () => {
            try {
                const audioContext = new AudioContext();
                const response = await fetch(props.audioFile);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                setAudioContext(audioContext);
                setAudioBuffer(audioBuffer);
            } catch (error) {
                console.error(error);
            }
        };

        loadAudio();
    }, [props.audioFile]);

    useEffect(() => {
        const handleClick = () => {
            if (audioContext && audioBuffer) {
                const sourceNode = audioContext.createBufferSource();
                sourceNode.buffer = audioBuffer;
                sourceNode.loop = true;

                // Volume control
                const volumeNode = audioContext.createGain();
                volumeNode.gain.value = 0.5;

                // Lowpass filter
                const filterNode = audioContext.createBiquadFilter();
                filterNode.type = "lowpass";
                filterNode.frequency.value = 20000;

                sourceNode.connect(filterNode);
                filterNode.connect(volumeNode);
                volumeNode.connect(audioContext.destination);

                sourceNode.start();
                setSourceNode(sourceNode);
                setVolumeNode(volumeNode);
                setFilterNode(filterNode);
            }
        }
        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [audioContext, audioBuffer]);

    useEffect(() => {
        return () => {
            if (sourceNode) {
                sourceNode.stop();
                sourceNode.disconnect();
            }
            if (volumeNode) {
                volumeNode.disconnect();
            }
            if (filterNode) {
                filterNode.disconnect();
            }
        };
    }, [sourceNode, volumeNode, filterNode]);

    props.setVolumeSmoothlyRef.current = (freq: number) => {
        // Smoothly update filter cutoff
        if (filterNode?.frequency && audioContext) {
            filterNode.frequency.setTargetAtTime(
                freq,
                audioContext.currentTime,
                0.5 // Transition time in seconds
            );
        }
    }

    return null;
}

export default LoopingAudio;