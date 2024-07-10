// view for the main page of the app
export default function Main(){

    /**
     * Function to go to the plants page
     */
    function goToPlants(){
        window.location.href = '/plants';
    }

    /**
     * Function to go to the info page
     * 
     */
    function goToInfo(){
        window.location.href = '/info';
    }

    /**
     * Function to go to the about page
     * 
     */
    function goToAbout(){
        window.location.href = '/about';
    }

    /**
     * Function to go to the edit user page
     * 
     */
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