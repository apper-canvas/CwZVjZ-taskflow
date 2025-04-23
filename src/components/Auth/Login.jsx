import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setError, setLoading } from '../../store/userSlice';
import apperService from '../../services/apperService';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    
    const onSuccess = (user, account) => {
      dispatch(setUser(user));
      navigate('/dashboard');
    };
    
    const onError = (error) => {
      console.error('Authentication error:', error);
      dispatch(setError('Authentication failed. Please try again.'));
    };
    
    const apperUI = apperService.setupAuth('#authentication', onSuccess, onError);
    
    if (apperUI) {
      apperUI.showLogin('#authentication');
    }
    
    dispatch(setLoading(false));
    
    return () => {
      // Cleanup if needed
    };
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button 
              onClick={() => navigate('/register')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </button>
          </p>
        </div>
        <div id="authentication" className="min-h-[400px] flex items-center justify-center" />
      </div>
    </div>
  );
}

export default Login;