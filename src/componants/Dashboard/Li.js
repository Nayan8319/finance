import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Li(props) {

    //tab Name
    //function to set Tab
    //4 css classes activeTabCss , inactiveTabCss , activeIconCss , inactiveIconCss

    return (
        <li>
            <a onClick={() => { props.setActiveTab(props.tabName) }} href="#nothing" className={(props.tabName === props.activeTab ) ? props.activeTabCss : props.inactiveTabCss }>
                <FontAwesomeIcon icon={props.icon} size='sm'/>
                <span className="ml-3">{props.tabName}</span>
            </a>
        </li>
    )
}

export default Li