import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/State';
import { Car } from '../../../utils/Interfaces';

function AdminCarList() {
    const token = useSelector((state: RootState) => state.auth.token) as unknown as string
    const [error, setError] = useState<string | null>(null);
    const [carList, setCarList] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const filteredCars = carList.filter((cars: any) => {
        const matchingQuery = cars.modelID.toLowerCase()
        return matchingQuery
    })



    useEffect(() => {
        fetchData();
    }, []);

  return (
      <table className="ad-car-table">
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Manufacturer Name</th>
                  <th>Released Date</th>
                  <th>Country</th>
              </tr>
          </thead>
          <tbody>
              {loading ? (
                  <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                          <div className="ad-car-spinner"></div>
                      </td>
                  </tr>
              ) : error ? (
                  <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                          {error}
                          <button onClick={fetchData} className="ad-car-retry-btn">Retry</button>
                      </td>
                  </tr>
              ) : filteredCars.length > 0 ? (
                  filteredCars.map((model: any, index: number) => (
                      <tr key={index}>
                          <td onClick={() => { }}>{model.modelID}</td>
                          <td>{model.manufacturerName}</td>
                          <td>{model.releasedDate}</td>
                          <td>{model.country}</td>
                      </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={5}>No cars found</td>
                  </tr>
              )}
          </tbody>
      </table>
  );
}

export default AdminCarList;