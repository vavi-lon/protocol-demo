import ProtocolStoryboard from '../components/ProtocolStoryboard';

/**
 * /protocol/walkthrough — fullscreen, auto-playing 4-frame reader.
 *
 * Body-scroll locking is owned by ProtocolStoryboard itself: it locks while
 * the cinematic frames play and releases the lock when the user hits "Try it
 * yourself" so the underlying ProtocolStepper can scroll naturally.
 */
const ProtocolWalkthroughPage = () => <ProtocolStoryboard />;

export default ProtocolWalkthroughPage;
