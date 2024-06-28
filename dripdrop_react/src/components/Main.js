export default function Main(){

    function goToPlants(){
        window.location.href = '/plants';
    }

    function goToInfo(){
        window.location.href = '/info';
    }

    function goToAbout(){
        window.location.href = '/about';
    }

    function goToEditUser(){
        window.location.href = '/user/' + localStorage.getItem('userId') + '/edit';
    }

    return(
        <div>
            <table align='center'>
                <tbody>
                    <tr>
                        <th>
                            <button class="buttonBlue" style={{height: '80px'}} onClick={goToPlants}>Plantas</button>
                        </th>
                        <th>
                            <button class="buttonBlue" style={{height: '80px'}} onClick={goToAbout}>Sobre</button>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <button class="buttonBlue" style={{height: '80px'}} onClick={goToInfo}>Aprenda!</button>
                        </th>
                        <th>
                            <button class="buttonBlue" style={{height: '80px'}} onClick={goToEditUser}>Definições</button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}