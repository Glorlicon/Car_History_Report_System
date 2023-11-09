import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetMaintenanceDetails } from '../../services/api/CarMaintenance';
import { RootState } from '../../store/State';
import { APIResponse, ModelMaintainanceResponse } from '../../utils/Interfaces';

function CarMaintenanceDetails() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    type RouteParams = {
        id: string
    }
    const { id } = useParams<RouteParams>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [maintainanceDetails, setMaintainanceDetails] = useState<ModelMaintainanceResponse>()
    const [section,setSection] = useState(0)
    if (!id) {
        setError("Not valid vin ID")
        return
    }
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        const response: APIResponse = await GetMaintenanceDetails(id, token)
        if (response.error) {
            setError(response.error)
        } else {
            setMaintainanceDetails(response.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="car-maintenance-details-page">
            {loading ? (
                <div className="car-maintenance-details-spinner"></div>
            ) : error ? (
                    <div className="car-maintenance-details-load-error">
                        {error}
                        <button onClick={fetchData} className="car-maintenance-details-retry-btn">Retry</button>
                    </div>
            ): (
                <>
                <div className="car-maintenance-details-navigator">
                    <a href="/maintenance">&#8592;Garage</a>
                    <a onClick={() => setSection(0)}>Dashboard</a>
                    <a onClick={() => setSection(1)}>Service History</a>
                    <a onClick={() => setSection(2)}>Maintenance Schedule</a>
                </div>
                </>
            )}
      </div>
  );
}

export default CarMaintenanceDetails;