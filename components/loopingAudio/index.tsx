import { useEffect, useState } from "react";

//cutoff is a low pass fulter cutoff
function LoopingAudio(props: { audioFile: string, volume: number, cutoff: number }) {
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
        if (audioContext && audioBuffer) {
            const sourceNode = audioContext.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.loop = true;

            // Volume control
            const volumeNode = audioContext.createGain();
            volumeNode.gain.value = props.volume ?? 1;

            // Lowpass filter
            const filterNode = audioContext.createBiquadFilter();
            filterNode.type = "lowpass";
            filterNode.frequency.value = props.cutoff ?? 20000;

            sourceNode.connect(filterNode);
            filterNode.connect(volumeNode);
            volumeNode.connect(audioContext.destination);

            sourceNode.start();
            setSourceNode(sourceNode);
            setVolumeNode(volumeNode);
            setFilterNode(filterNode);
        }
    }, [audioContext, audioBuffer, props.volume, props.cutoff]);

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

    return null;
}

export default LoopingAudio;