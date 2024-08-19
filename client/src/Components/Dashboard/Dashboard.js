import DashNavbar from "../DashNavbar/DashNavbar"
import DashboardHome from "../DashboardHome/DashboardHome"
import './Dashboard.css'

export default function Dashboard (){
    return (
        <>
        
        <div className="dashboard">
            <DashNavbar/>
            <DashboardHome/>
        </div>
        </>
    )
}