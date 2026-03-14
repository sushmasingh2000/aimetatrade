import Dashboard from "../Dashboard";
import Markets from "../Markets";
import Layouts from "../Layouts/Layout";
import More from "../More";
import News from "../News";
import Sidebar from "../Sidebar";
import Withdrawal from "../Withdrawal";
import Deposit from "../Deposit";
import Transfer from "../Transfer";
import Help from "../Help";
import About from "../About";
import Futures from "../Futures";
import Prepetual from "../Prepetual";
import AssetsPage from "../AssetsPage";
import Spot from "../Spot";
import Share from "../Share";
import Level from "../Level";
import Promotional from "../Promotional";
import DepositeHistory from "../Depositehistory";
import WithdrawHistory from "../Withdrawlhistory";
import TransferHistory from "../TransferHistory";
import SoonComming from "../SoonComming";
import ProfilePage from "../Profile";
import OfficialLinks from "../OfficialLink";
import Security from "../Security";
import ChangeLoginPassword from "../ChangePassword";
import WeeklySalary from "../Income/WeeklySalary";
import TradeProfit from "../Income/TradeProfit";
import SameRank from "../Income/SamerankBonus";
import Partnmer from "../Income/PArtnerBonus";
import OneTime from "../Income/OneTimeReweard";
import FirstDeposit from "../Income/FirstDeposit";
import EveryDeposit from "../Income/Everydeposit";
import DividentBonus from "../Income/DividendBonus";
import DefferentailIncome from "../Income/DifferentailIncome";
import WithdrawalAddressSave from "../WithdrawalAddressSave";
import AllLevel from "../LevelAll";
import MArketdata from "../Market";
import FuturesTrade from "../Trade/FuturesTrade";
import MyTrades from "../Trade";
import TradeGraph from "../TradeGraph";
import ForexMarketTable from "../ForexMarketTable";
import ForexChart from "../ForexChart";

export const routes = [
    {
        path: "/",
        component: <Layouts header={false}>
            <Dashboard />
        </Layouts>
    },
    {
     path: "/Dashboard",
        component: <Layouts header={false}>
            <Dashboard />
        </Layouts>
    },
    {
        path: "/markets",
        component: <Layouts header={false}>
            <Markets />
        </Layouts>
    },
    {
        path: "/More",
        component: <Layouts header={false} >
            <More />
        </Layouts>
    },
    {
        path: "/News",
        component: <Layouts header={false} >
            <News />
        </Layouts>
    },

    {
        path: "/Sidebar",
        component: <Layouts header={false} >
            <Sidebar />
        </Layouts>
    },
    {
        path: "/Withdrawal",
        component: <Layouts header={false} >
            <Withdrawal />
        </Layouts>
    },
    {
        path: "/Deposit",
        component: <Layouts header={false} >
            <Deposit />
        </Layouts>
    },
    {
        path: "/Transfer",
        component: <Layouts header={false} >
            <Transfer />
        </Layouts>
    },
    {
        path: "/Help",
        component: <Layouts header={false} >
            <Help />
        </Layouts>
    },
    {
        path: "/About",
        component: <Layouts header={false} >
            <About />
        </Layouts>
    },
    
    {
        path: "/Futures",
        component: <Layouts header={false} >
            <Futures />
        </Layouts>
    },
    {
        path: "/Prepetual",
        component: <Layouts header={false} >
            <Prepetual />
        </Layouts>
    },
     {
        path: "/AssetsPage",
        component: <Layouts header={false} >
            <AssetsPage />
        </Layouts>
    },
    {
        path: "/Spot",
        component: <Layouts header={false} >
            <Spot />
        </Layouts>
    },
    {
        path: "/Share",
        component: <Layouts header={false} >
            <Share />
        </Layouts>
    },
     {
        path: "/level/:id",
        component: <Layouts header={false} >
            <Level />
        </Layouts>
    },
     {
        path: "/all_level",
        component: <Layouts header={false} >
            <AllLevel />
        </Layouts>
    },
    {
        path: "/promotional",
        component: <Layouts header={false} >
            <Promotional />
        </Layouts>
    },
    
     {
        path: "/Deposite-history",
        component: <Layouts header={false} >
            <DepositeHistory />
        </Layouts>
    },
    {
        path: "/withdrawal-history",
        component: <Layouts header={false} >
            <WithdrawHistory />
        </Layouts>
    },
      {
        path: "/transfer-history",
        component: <Layouts header={false} >
            <TransferHistory />
        </Layouts>
    },
      {
        path: "/coming-soon",
        component: <Layouts header={false} >
            <SoonComming />
        </Layouts>
    },
     {
        path: "/soon",
        component: <Layouts header={false} >
            <SoonComming />
        </Layouts>
    },
     {
        path: "/profile",
        component: <Layouts header={false} >
            <ProfilePage />
        </Layouts>
    },
     {
        path: "/official",
        component: <Layouts header={false} >
            <OfficialLinks />
        </Layouts>
    },
    {
        path: "/security",
        component: <Layouts header={false} >
            <Security />
        </Layouts>
    },
     {
        path: "/change_password",
        component: <Layouts header={false} >
            <ChangeLoginPassword />
        </Layouts>
    },
     {
        path: "/update-wallet-address",
        component: <Layouts header={false} >
            <WithdrawalAddressSave />
        </Layouts>
    },
    {
        path: "/weekly",
        component: <Layouts header={false} >
            <WeeklySalary />
        </Layouts>
    },
      {
        path: "/trade_profit",
        component: <Layouts header={false} >
            <TradeProfit />
        </Layouts>
    },
     {
        path: "/same_rank",
        component: <Layouts header={false} >
            <SameRank />
        </Layouts>
    },
     {
        path: "/partner",
        component: <Layouts header={false} >
            <Partnmer />
        </Layouts>
    },
     {
        path: "/onetime",
        component: <Layouts header={false} >
            <OneTime />
        </Layouts>
    },
     {
        path: "/firstdeposit",
        component: <Layouts header={false} >
            <FirstDeposit />
        </Layouts>
    },
      {
        path: "/everyDeposite",
        component: <Layouts header={false} >
            <EveryDeposit />
        </Layouts>
    },
     {
        path: "/dividentBonus",
        component: <Layouts header={false} >
            <DividentBonus />
        </Layouts>
    },
      {
        path: "/differential_income",
        component: <Layouts header={false} >
            <DefferentailIncome />
        </Layouts>
    },
     {
        path: "/crypto",
        component: <Layouts header={false} >
            <MArketdata />
        </Layouts>
    },

      {
        path: "/futures/:symbol",
        component: <Layouts header={false} >
            <FuturesTrade />
        </Layouts>
    },
    {
        path: "/futures",
        component: <Layouts header={false} >
            <FuturesTrade />
        </Layouts>
    },
    {
        path: "/futures/BTCUSDT",
        component: <Layouts header={false} >
            <FuturesTrade />
        </Layouts>
    },
    {
        path: "/MyTrades",
        component: <Layouts header={false} >
            <TradeGraph />
        </Layouts>
    },
    {
        path: "/forex-market",
        component: <Layouts header={false} >
            <ForexMarketTable />
        </Layouts>
    },
    {
        path: "/forex-chart",
        component: <Layouts header={false} >
            <ForexChart />
        </Layouts>
    },
]