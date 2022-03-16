import api from "./api";
/**
 * @returns {array} data The fetched json database
 */
export const fetchSearchData = (async() => {
    return api.get(`plasmids/meta`)
        .then(async(response) => {
            const data = await response.data.plasmids;
            if (response.status !== 200){
                return Promise.reject(response.statusText);
            }
            return data;
        })
})

/**
 * @param  {array} featureData The data related to feature types
 * @returns {array} featureTemp The array of features
 */
export const fetchFeatures = (async(featureData) => {
    console.log(api.baseURL)
    return api.get(`features`)
        .then(async(response) => {
            const convert = response.data
            let featureTemp = [];
            convert.user = [];
            convert.restrictionSites = [];
            let totalFeatures = -1;
            for (let i = 0; i < featureData.length; i++){
                featureTemp = [...featureTemp,...convert[featureData[i].id].map((v) => {
                                    totalFeatures += 1;
                                    return {name:v.name,start:v.start,stop:v.stop,legend:featureData[i].display,source:"json-feature",tags:totalFeatures,visible:true,strand:v.stop < v.start ? -1 : 1}
                                })
                            ]
            }
            const restrictionSites = convert?.restriction.map((v,i) => {
            let start = v.locations[0][0];
            let stop = v.locations[0][1];
            let newFeature = {name:v.name,start:start,stop:stop,legend:"Restriction Sites",source:"json-feature",visible:v.count === 1,count:v.count};
            if(stop < start){
                newFeature.strand = -1;
            }
            return newFeature;
            })
            console.log(restrictionSites);
            featureTemp = [...featureTemp, ...restrictionSites];
            return featureTemp;
        })
})