import './style.css';
import { Terminal } from './ui/terminal';
import { Visualizer } from './ui/visualizer';
import { SettingsModal } from './ui/settings';
import { Deck } from './ui/deck';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Init UI Components
    const terminal = new Terminal('terminal-output');
    const visualizer = new Visualizer('visualizer-canvas');
    const settings = new SettingsModal('settings-modal', 'btn-settings');

    // 2. Init Deck Controller
    const deck = new Deck(terminal, visualizer);

    // 3. Welcome Message
    terminal.log("SYSTEM BOOT SEQUENCE INITIATED...");
    terminal.log("LOADING CORE MODULES...");
    terminal.log("AUDIO ENGINE: STANDBY");
    terminal.log("Waiting for user input [GENERATE]...");
});
