export default function Main(){

    function goToPlants(){
        window.location.href = '/plants';
    }

    return(
        <div>
            <button onClick={goToPlants}>Plants</button>
            <button>About</button>
            <button>Info</button>
            <button>Settings</button>
        </div>
    )
}