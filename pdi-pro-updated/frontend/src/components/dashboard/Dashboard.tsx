import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInspection } from '../../contexts/InspectionContext';
import { Car, Plus, Download, Eye, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateInspectionPDF } from '../../utils/pdfGenerator';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Inspection {
  _id: string;
  vehicleDetails: {
    clientName: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleIdentificationNumber: string;
  };
  status: 'Draft' | 'Completed';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { resetInspection } = useInspection();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/inspections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInspections(data.inspections);
      }
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewInspection = () => {
    resetInspection();
    navigate('/inspection');
  };

  const handleViewInspection = (inspectionId: string) => {
    navigate(`/inspection/${inspectionId}`);
  };

  const handleDownloadPDF = async (inspection: Inspection) => {
    setGeneratingPDF(prev => ({ ...prev, [inspection._id]: true }));

    try {
      await generateInspectionPDF(inspection as any);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(prev => ({ ...prev, [inspection._id]: false }));
    }
  };

  const handleDeleteInspection = async (inspectionId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this inspection? This action cannot be undone.');

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/inspections/${inspectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchInspections();
      } else {
        throw new Error('Failed to delete inspection');
      }
    } catch (error) {
      console.error('Error deleting inspection:', error);
      alert('Failed to delete inspection. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Car className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-xl font-semibold text-gray-800">PDC Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage and view all your vehicle inspections.</p>
        </div>

        <div className="mb-6">
          <button
            onClick={handleNewInspection}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Inspection
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Past Inspections</h2>
            <p className="text-sm text-gray-600">Review your previously saved inspections.</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading inspections...</p>
              </div>
            ) : inspections.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections yet</h3>
                <p className="text-gray-600 mb-6">Start your first vehicle inspection to see it here.</p>
                <button
                  onClick={handleNewInspection}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create New Inspection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <div key={inspection._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Car className="w-5 h-5 text-gray-400 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">
                            {inspection.vehicleDetails.vehicleMake} {inspection.vehicleDetails.vehicleModel}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>VIN: {inspection.vehicleDetails.vehicleIdentificationNumber}</p>
                          <p>Client: {inspection.vehicleDetails.clientName}</p>
                          <p>Date: {formatDate(inspection.createdAt)}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-gray-500 mr-2">Status:</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${inspection.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                              {inspection.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-6">
                        <button
                          onClick={() => handleViewInspection(inspection._id)}
                          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View / Edit
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownloadPDF(inspection)}
                            disabled={generatingPDF[inspection._id]}
                            className="flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            {generatingPDF[inspection._id] ? 'Generating...' : 'PDF'}
                          </button>
                          <button
                            onClick={() => handleDeleteInspection(inspection._id)}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center transition-colors"
                            title="Delete inspection"
                          >
                            <span className="text-white text-xs font-bold">🗑</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 PDC Pro. All rights reserved.<br />
          Made with love by <span className="text-blue-600">Karishma</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
