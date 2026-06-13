import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="text-gray-400 hover:text-white"
      style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1.5rem', fontFamily: 'Oswald', textTransform: 'uppercase', fontSize: '0.875rem' }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
    </button>
  );
};

export default ThemeToggle;
