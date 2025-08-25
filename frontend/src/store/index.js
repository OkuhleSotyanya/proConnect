import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    jobRequestInfo: [],
    jobCompletedInfo: [],
    jobPendingInfo: [],
    contractorProfile: null,
    contractorsList: []
  },
  mutations: {
    SET_JOB_REQUESTS(state, jobRequest) {
      state.jobRequestInfo = jobRequest;
    },
    SET_JOB_PENDING(state, jobPending) {
      state.jobPendingInfo = jobPending;
    },
    SET_JOB_COMPLETED(state, jobCompleted) {
      state.jobCompletedInfo = jobCompleted;
    },
    SET_CONTRACTOR_PROFILE(state, profile) {
      state.contractorProfile = profile;
    },
    SET_CONTRACTORS_LIST(state, contractors) {
      state.contractorsList = contractors;
    },
    UPDATE_JOB_STATUS(state, { jobId, status }) {
      // Update status in pending and requests
      state.jobPendingInfo = state.jobPendingInfo.map(job => job.job_id === jobId ? { ...job, status } : job)
      state.jobRequestInfo = state.jobRequestInfo.map(job => job.job_id === jobId ? { ...job, status } : job)

      // If completed, move it to completed array
      if (status === 'completed') {
        const completedJob = state.jobPendingInfo.find(job => job.job_id === jobId)
        if (completedJob) {
          state.jobCompletedInfo.push({ ...completedJob, status: 'completed' })
          state.jobPendingInfo = state.jobPendingInfo.filter(job => job.job_id !== jobId)
        }
      }
    }
  },
  actions: {
    async fetchContractors({ commit }) {
      try {
        const res = await axios.get('http://localhost:3000/contractors');
        commit('SET_CONTRACTORS_LIST', res.data.data);
      } catch (err) {
        console.error('Error fetching contractors:', err);
      }
    },
    async fetchJobRequest({ commit }, contractorId) {
      try {
        const res = await axios.get(`http://localhost:3000/jobRequest?contractorId=${contractorId}`);
        commit('SET_JOB_REQUESTS', res.data.data);
      } catch (err) { console.error(err); }
    },
    async fetchJobPending({ commit }, contractorId) {
      try {
        const res = await axios.get(`http://localhost:3000/jobPending?contractorId=${contractorId}`);
        commit('SET_JOB_PENDING', res.data.data);
      } catch (err) { console.error(err); }
    },
    async fetchJobCompleted({ commit }, contractorId) {
      try {
        const res = await axios.get(`http://localhost:3000/jobCompleted?contractorId=${contractorId}`);
        commit('SET_JOB_COMPLETED', res.data.data);
      } catch (err) { console.error(err); }
    },
    async markCompleted({ commit }, { jobId }) {
      try {
        await axios.patch(`http://localhost:3000/api/jobs/${jobId}/completed`);
        commit('UPDATE_JOB_STATUS', { jobId, status: 'completed' });
      } catch (err) { console.error(err); throw err; }
    },
    async acceptJob({ dispatch }, { job_id, contractorId }) {
      try {
        await axios.patch(`http://localhost:3000/api/jobRequest/${job_id}/accept`);
        dispatch('fetchJobRequest', contractorId);
        dispatch('fetchJobPending', contractorId);
      } catch (err) { console.error(err); }
    },
    async denyJob({ dispatch }, { job_id, contractorId }) {
      try {
        await axios.patch(`http://localhost:3000/api/jobRequest/${job_id}/deny`);
        dispatch('fetchJobRequest', contractorId);
      } catch (err) { console.error(err); }
    }
  },
  modules: {}
})
