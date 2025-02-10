import React, { useEffect, useState } from 'react';
import Main from './Dashboard/main_inner';
import Li from './Dashboard/Li';
import { getPermissions } from '../javaScript/functions';
import { faBagShopping, faCartShopping, faCreditCard, faHome , faSackDollar, faUsers } from '@fortawesome/free-solid-svg-icons';

const Mynav = (props) => {
   const [permissions, setPermissions] = useState([]);
 
   const fetchPermissionsAndPerformWork = async () => {
     if (props.panel === "User") {
       try {
         const response = await new Promise((resolve, reject) => {
           getPermissions(localStorage.getItem('email'), (e) => {
             resolve(e);
           });
         });
         setPermissions(response);
       } catch (error) {
         console.error("Error getting permissions:", error);
       }
     }
   };
 
   useEffect(() => {
     // Initial call when the component mounts
     fetchPermissionsAndPerformWork();
 
     // Set up an interval to call the function every 3 seconds
     const intervalId = setInterval(fetchPermissionsAndPerformWork, 1500);
 
     // Cleanup the interval when the component unmounts
     return () => clearInterval(intervalId);
     // eslint-disable-next-line
   },[]);

   //Function to remove permissions when user logout
   const removePermissions = () => setPermissions([])  ;

   //For toggling sidebar on Mobile
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   //For Active Tab
   const [activeTab, setActiveTab] = useState();

   //By default tab Dashboard
   useEffect(() => {
      setActiveTab("Dashboard");
   }, []);

   useEffect(()=>{
      setIsSidebarOpen(false);
   },[activeTab]);

   //Navbar's menu classes
   let activeTabCss = "text-base text-white font-medium rounded-lg flex items-center p-2 bg-blue-500 group";
   let inactiveTabCss = "text-base text-sky-900 font-medium rounded-lg flex items-center p-2 bg-white hover:bg-gray-100 hover:text-gray-800";

   return (
      <div>
         <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start">
                     <button id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar" className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <svg id="toggleSidebarMobileHamburger" className={(isSidebarOpen) ? "w-6 h-6 hidden" : "w-6 h-6"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                           <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <svg id="toggleSidebarMobileClose" className={(!isSidebarOpen) ? "w-6 h-6 hidden" : "w-6 h-6"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                     </button>
                     <a href="#nothing" className="text-xl font-bold flex items-center lg:ml-2.5">
                        {/* change Panel Name as per user (Admin/User) */}
                        <span className="self-center whitespace-nowrap text-gray-600">Finance {"(" + props.panel + ")"}</span>
                     </a>

                  </div>
                  <div className="flex items-center">
                     {/* Can add buttons to top right */}
                  </div>
               </div>
            </div>
         </nav>
         <div className="flex overflow-hidden bg-white pt-16">
            <aside id="sidebar" className={(isSidebarOpen) ? "fixed z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75" : "fixed z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75 hidden"} aria-label="Sidebar">
               <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                  <div className={(isSidebarOpen) ? "flex-1 flex flex-col pt-5 pb-4 overflow-y-auto" : "flex-1 flex flex-col pb-4 overflow-y-auto"}>

                     <div className="flex-1 px-3 bg-white divide-y space-y-1">
                        <ul className="space-y-2 pb-2">

                           {/* Menu Items */}
                           <Li icon={faHome}
                              tabName={"Dashboard"}
                              activeTab={activeTab}
                              activeTabCss={activeTabCss}
                              inactiveTabCss={inactiveTabCss}
                              setActiveTab={setActiveTab} />

                           { /* Product Managment Menu */
                              (permissions.includes("product") && props.panel === "User")?
                                 <>
                                    <Li icon={faCartShopping}
                                       tabName={"Product Managment"}
                                       activeTab={activeTab}
                                       activeTabCss={activeTabCss}
                                       inactiveTabCss={inactiveTabCss}
                                       setActiveTab={setActiveTab} />
                                 </>
                              : <></> 
                           }

                           {  /* Add Sales Menu */ 
                              (props.panel === "User" && permissions.includes("sale")) ? 
                                 <Li icon={faSackDollar}
                                    tabName={"Add Sale"}
                                    activeTab={activeTab}
                                    activeTabCss={activeTabCss}
                                    inactiveTabCss={inactiveTabCss}
                                    setActiveTab={setActiveTab} />
                              : <></>
                           }

                           {  /* Purchase menu */
                              (props.panel === "User" && permissions.includes("purchase")) ? 
                                 <Li icon={faBagShopping}
                                    tabName={"New Purchase"}
                                    activeTab={activeTab}
                                    activeTabCss={activeTabCss}
                                    inactiveTabCss={inactiveTabCss}
                                    setActiveTab={setActiveTab} />
                              : <></>
                           }

                           {  /* Contact Admin 
                              (props.panel === "User") ? 
                                 <Li icon={faPhone}
                                    tabName={"Contact Admin"}
                                    activeTab={activeTab}
                                    activeTabCss={activeTabCss}
                                    inactiveTabCss={inactiveTabCss}
                                    setActiveTab={setActiveTab} />
                              : <></>
                           */}

                           {  /* Sales report */
                              (props.panel === "Admin")?
                                 <Li icon={faSackDollar}
                                 tabName={"Sales report"}
                                 activeTab={activeTab}
                                 activeTabCss={activeTabCss}
                                 inactiveTabCss={inactiveTabCss}
                                 setActiveTab={setActiveTab} />
                              : <></>
                           }

                           {  /* Purchase Report */
                              (props.panel === "Admin")?
                                 <Li icon={faBagShopping}
                                 tabName={"Purchase report"}
                                 activeTab={activeTab}
                                 activeTabCss={activeTabCss}
                                 inactiveTabCss={inactiveTabCss}
                                 setActiveTab={setActiveTab} />
                              : <></>
                           }

                           {  /* Transactions */
                              (props.panel === "Admin")?
                                 <Li icon={faCreditCard}
                                 tabName={"Transactions"}
                                 activeTab={activeTab}
                                 activeTabCss={activeTabCss}
                                 inactiveTabCss={inactiveTabCss}
                                 setActiveTab={setActiveTab} />
                              : <></>
                           }

                           {  /* User Managment */
                              (props.panel === "Admin")?
                                 <Li icon={faUsers}
                                       tabName={"Manage Users"}
                                       activeTab={activeTab}
                                       activeTabCss={activeTabCss}
                                       inactiveTabCss={inactiveTabCss}
                                       setActiveTab={setActiveTab} />
                              : <></>
                           }

                           {/* logout button */}
                           <li>
                              <a href="#nothing" className="text-base text-white font-normal rounded-lg bg-red-500 hover:bg-red-700 flex items-center p-2 group" onClick={()=> { props.logout(removePermissions) } }>
                                 <svg className="w-6 h-6 text-white flex-shrink-0 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                                 </svg>
                                 <span className="ml-3 flex-1 whitespace-nowrap">Logout</span>
                              </a>
                           </li>
                        </ul>
                     </div>

                  </div>
               </div>
            </aside>

            <div className={(isSidebarOpen) ? "bg-gray-900 opacity-50 fixed inset-0 z-10 lg:hidden" : "bg-gray-900 opacity-50 fixed inset-0 z-10 hidden"} id="sidebarBackdrop" onClick={()=>setIsSidebarOpen(false)}></div>
            <Main tab={activeTab} />
         </div>
      </div>
   );
};

export default Mynav;
