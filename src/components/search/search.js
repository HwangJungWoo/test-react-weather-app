import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geo_api_url, geoApiOptions } from "../../api";

const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null);

    // 검색 데이터(searchData)를 인자로 받아서, 검색 데이터를 setSearch를 사용하여 
    // 상태 변수인 "search"에 저장하고, onSearchChange라는 콜백 함수를 호출
    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    const loadOptions = async (inputValue) => {
        return fetch(
            geo_api_url + `/cities?minPopulation=1000000&namePrefix=${inputValue}`, geoApiOptions
        )
            .then((res) => res.json())
            .then((res) => {
                return {
                    // options는 react-select-async-paginate 컴포넌트에서 사용되는 속성입니다. 
                    // 이 속성은 드롭다운 메뉴에 표시될 선택 항목들의 배열을 담고 있습니다. 
                    // 사용자가 검색어를 입력하면, loadOptions 함수가 호출되어 비동기 방식으로 데이터를 가져옵니다. 
                    // 가져온 데이터를 바탕으로 options 배열이 생성되며, 이 배열은 각 선택 항목의 value와 label 정보를 포함합니다.
                    options: res.data.map((city) => {
                        return {
                            value: `${city.latitude} ${city.longitude}`,
                            label: `${city.name}, ${city.countryCode}`
                        }
                    })
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        /*
        1. loadOptions (필수): 검색어를 기반으로 옵션을 비동기로 가져오는 함수입니다. 
           이 함수는 입력값을 인자로 받고, 결과 객체를 반환해야 합니다. 결과 객체는 options 속성을 포함해야 하며, 이 속성은 선택 가능한 옵션의 배열입니다.
        2. onChange: 옵션을 선택할 때 호출되는 콜백 함수입니다. 선택된 옵션 객체를 인자로 받습니다.
        3. value: 현재 선택된 옵션을 나타내는 객체입니다. 선택한 옵션을 관리하기 위해 상태 변수와 함께 사용할 수 있습니다.
        4. placeholder: 검색창에 표시되는 텍스트입니다.
        5. debounceTimeout: 검색어 입력 후, 검색을 시작하기까지의 디바운스 시간을 밀리초 단위로 설정합니다. 
           이 설정을 사용하면, 사용자가 검색어를 입력하는 동안 다른 이벤트가 중복해서 발생하는 것을 방지할 수 있습니다.
        */
        <AsyncPaginate
            placeholder="Search for city"
            // 검색어 입력 후, 검색을 시작하기까지의 디바운스 시간을 밀리초 단위로 설정합니다. 
            // 이 설정을 사용하면, 사용자가 검색어를 입력하는 동안 다른 이벤트가 중복해서 발생하는 것을 방지
            debounceTimeout={600}
            value={search}
            // 선택 목록에서 값을 선택하면 호출되는 콜백 함수
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
}

export default Search;