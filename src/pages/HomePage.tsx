import '../App.css';
import { NameForm } from '../components/forms';
import { Header } from '../components/ui';
import { UpdateNotification } from '../components';

function HomePage() {
  return (
    <div className="App">
      <UpdateNotification />
      <Header />
      <NameForm />
    </div>
  );
}

export default HomePage;
