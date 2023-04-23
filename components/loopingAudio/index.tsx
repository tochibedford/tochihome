import styles from './loopingAudio.module.scss'
import { MutableRefObject, useEffect, useRef, useState } from "react";

function LoopingAudio(props: { audioFile: string, setFreqSmoothlyRef: MutableRefObject<((freq: number) => void) | undefined> }) {
    const MAX_VOLUME = 0.3
    const [audioContext, setAudioContext] = useState<AudioContext>();
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
    const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode>();
    const [volumeNode, setVolumeNode] = useState<GainNode>();
    const [filterNode, setFilterNode] = useState<BiquadFilterNode>();

    const [isUnmuted, setIsUnmuted] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

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
        const container = containerRef.current
        const handleClick = () => {
            if (audioContext && audioBuffer) {
                const sourceNode = audioContext.createBufferSource();
                sourceNode.buffer = audioBuffer;
                sourceNode.loop = true;

                // Volume control
                const volumeNode = audioContext.createGain();
                volumeNode.gain.value = MAX_VOLUME;

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

                setIsUnmuted(true)
                container?.removeEventListener('click', handleClick)
            }
        }
        container?.addEventListener('click', handleClick)

        return () => {
            container?.removeEventListener('click', handleClick)
        }
    }, [audioContext, audioBuffer]);

    useEffect(() => { // handle unmounts
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

    props.setFreqSmoothlyRef.current = (freq: number) => {
        // Smoothly update filter cutoff
        if (filterNode?.frequency && audioContext) {
            filterNode.frequency.setTargetAtTime(
                freq,
                audioContext.currentTime,
                0.5
            );
        }
    }

    const setVolumeSmoothly = (vol: number) => {
        // Smoothly update volume
        if (volumeNode?.gain && audioContext) {
            volumeNode.gain.setTargetAtTime(
                vol,
                audioContext.currentTime,
                0.3
            );
        }
    }

    useEffect(() => {
        setVolumeSmoothly(isUnmuted ? MAX_VOLUME : 0)
    }, [isUnmuted])

    return (
        <div className={[styles.container, isUnmuted ? styles.isAnimated : ""].join(" ")} ref={containerRef}>
            <input type="checkbox" onChange={(e) => setIsUnmuted(e.currentTarget.checked)} checked={isUnmuted} />
            <div className={styles.stroke}></div>
            🎵
        </div>
    );
}

export default LoopingAudio;