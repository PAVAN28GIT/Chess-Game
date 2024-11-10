import React , {useEffect} from 'react'
import { showToast } from '../../utils/toast';


function Dashboard() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'success') {
      showToast('Logged in successfully', 'success');
      // remove the status query parameter from the URL after showing the toast
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard