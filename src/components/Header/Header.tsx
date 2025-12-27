import classes from './Header.module.css';

export default function Header() {
  const signOut = () => {
		localStorage.removeItem("authToken");
		window.location.reload();
  }

  return (
    <div className={classes.header}>
      <h2>Calendshare</h2>
      <a href="#" onClick={signOut}>Sign Out</a>
    </div>
  )
}
