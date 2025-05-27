import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Cookies from "js-cookie";
import Notes from "../components/Notes";
import Navbar from "../components/Navbar";
import { delet, get, post, put } from "../services/ApiEndPoint";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import EidtModal from "../components/EidtModal";
import DeleteModal from "../components/DeleteModal";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [updatetitle, setUpdatetitle] = useState("");
  const [modalId, setModalId] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [refersh, setRefersh] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const filteredNotes = notes.filter((note) => {
    if (!note.title) return false; // skip if no title
    return note.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleNoteSubmit = async () => {
    try {
      const request = await post("/notes/create", { title });
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        setRefersh(!refersh);
        setCloseModal(true);
        setShowMobileSidebar(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  const handeleUpdate = async () => {
    try {
      const request = await put(`/notes/update/${modalId}`, {
        title: updatetitle,
      });
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        setRefersh(!refersh);
        setCloseModal(true);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  const handelNotesDelete = async () => {
    try {
      const request = await delet(`/notes/delete/${modalId}`);
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        setRefersh(!refersh);
        setCloseModal(true);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const request = await get("/notes/getnotes");
        const response = request.data;
        setNotes(response.Notes || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotes();
  }, [refersh]);

  return (
    <>
      {/* Modals */}
      <Modal
        Modaltitle={"Write Notes"}
        value={title}
        handleChange={(e) => setTitle(e.target.value)}
        handleNoteSubmit={handleNoteSubmit}
        HandleClose={closeModal}
      />
      <EidtModal
        Modaltitle={"Updated Notes"}
        handleChange={(e) => setUpdatetitle(e.target.value)}
        handleNoteSubmit={handeleUpdate}
        value={updatetitle}
      />
      <DeleteModal handelNotesDelete={handelNotesDelete} />

      <div className="container-fluid">
        {/* Navbar always on top */}
        <Navbar />

        <div className="row flex-column flex-md-row">
          {/* Desktop Sidebar */}
          <div className="d-none d-md-block col-md-3 col-lg-2 shadow p-3 min-vh-100">
            <SideBar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div className="mobile-sidebar-overlay position-fixed top-0 start-0 w-100 h-100 bg-white p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Add Note</h4>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  Close
                </button>
              </div>
              <SideBar />
            </div>
          )}

          {/* Main Content */}
          <div className="col-12 col-md-9 col-lg-10 px-4">
            {/* Search and Add Note - visible always below navbar */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mt-3 mb-3 gap-2">
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Search"
                style={{ minWidth: "150px", maxWidth: "300px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm d-md-none"
                onClick={() => setShowMobileSidebar(true)}
              >
                Add Note
              </button>
            </div>

            {filteredNotes.length > 0 ? (
              <>
                <h1 className="fs-2 fw-bold">NOTES</h1>
                <div className="row mt-4 g-4">
                  {filteredNotes.map((note) => (
                    <div className="col-12 col-sm-6 col-md-4" key={note._id}>
                      <Notes
                        title={note.title}
                        date={formatDate(note.updatedAt)}
                        handleUpdate={() => setModalId(note._id)}
                        handleDelete={() => setModalId(note._id)}
                        openDropdownId={openDropdownId}
                        setOpenDropdownId={setOpenDropdownId}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-5 d-flex justify-content-center align-items-center">
                <h1 className="fs-4 fw-bold text-center">No Notes Found</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
