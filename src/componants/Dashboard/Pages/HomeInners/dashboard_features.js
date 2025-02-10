import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import feature from "./features.json";

function DashFeature() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container py-5 mx-auto">

        <div className="text-center ">
          <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-5">
            Features Provided By Our Team
          </h1>
        </div>

        <div className="flex flex-wrap lg:w-full sm:mx-auto sm:mb-2 -mx-2">
          {feature.map(((value,index) => {
            return (
                <div className="p-4 sm:w-1/2 w-full" key={index}>
                  <div className="bg-gray-100 shadow rounded flex p-4 h-full items-center">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-4 text-green-600" size="lg"/>
                    <span className="title-font font-large">{value}</span>
                  </div>
                </div>
            );
          }))}
        </div>

      </div>
    </section>
  );
}

export default DashFeature;