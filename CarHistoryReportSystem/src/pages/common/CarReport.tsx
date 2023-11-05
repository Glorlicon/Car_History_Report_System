import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetReport } from '../../services/api/Reports';
import { APIResponse } from '../../utils/Interfaces';

function CarReport() {
    type RouteParams = {
        vin: string
    }
    const { vin } = useParams<RouteParams>()

    const fetchData = async () => {
        const response: APIResponse = await GetReport(vin as string)
        console.log(response.data)
    }
    useEffect(() => {
        fetchData()
    },[])
  return (
    <p>Hello world!</p>
  );
}

export default CarReport;