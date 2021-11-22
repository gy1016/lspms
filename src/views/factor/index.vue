<template>
  <div id="app-main-factor">
    <div class="filter-container">
      <el-input
        v-model="listQuery.IndexName"
        placeholder="指标名称"
        style="width: 200px;margin-right: 10px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      ></el-input>
      <el-input
        v-model="listQuery.Remark"
        placeholder="指标描述"
        style="width: 200px;margin-right: 10px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      ></el-input>
      <el-select
        v-model="listQuery.IndexType"
        style="width: 200px;margin-right: 10px"
        placeholder="分类"
        learable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.IndexType"
          :label="item.label + ' (' + item.num + ')'"
          :value="item.IndexType"
        />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      :height="this.tableHeight"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="60"
      >
      </el-table-column>
      <el-table-column label="指标名称" min-width="150px">
        <template slot-scope="{row:{IndexNameWrapper}}">
          <span v-html="IndexNameWrapper"></span>
        </template>
      </el-table-column>
      <el-table-column label="指标类别" min-width="60px">
        <template slot-scope="{row}">
          {{ row.IndexType | mapCategory }}
        </template>
      </el-table-column>
      <el-table-column label="指标预警值" min-width="40px">
        <template slot-scope="{row}">
          {{ row.AlarmValue }}
        </template>
      </el-table-column>
      <el-table-column label="指标含义" min-width="100px">
        <template slot-scope="{row:{RemarkWrapper}}">
          <span v-html="RemarkWrapper"></span>
          <!--{{featureWrapper}}-->
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" fixed="right">
        <template slot-scope="{ row }">
<!--          <el-button type="text" icon="el-icon-view" @click="openIndex(row)"/>-->
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getFactorList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="指标名称" prop="IndexName">
          <el-input v-model="temp.IndexName" />
        </el-form-item>
        <el-form-item label="指标类别" prop="IndexType">
          <el-select v-model="temp.IndexType" class="filter-item" placeholder="请选择指标类别：">
            <el-option v-for="item in categoryList" :key="item.IndexType" :label="item.label" :value="item.IndexType" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警值" prop="AlarmValue">
          <el-input v-model="temp.AlarmValue" />
        </el-form-item>
        <el-form-item label="指标含义" prop="Remark">
          <el-input v-model="temp.Remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入指标含义：" />
        </el-form-item>
        <el-form-item :label="dialogStatus==='create'?'创建时间':'更新时间'" prop="currentDate">
          <el-date-picker
            v-model="temp.currentDate"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategory, fetchList, createFactor, updateFactor, deleteFactor } from '@/network/factor'
import Pagination from '@/components/Pagination/index'
import waves from '@/directive/waves'
import { yymmdd } from '@/utils/index'

export default {
  name: 'Factor',
  data () {
    return {
      tableKey: 0,
      tableHeight: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      showCover: false,
      categoryList: [],
      downloadLoading: false,
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        IndexName: '',
        Remark: '',
        AlarmValue: 0,
        IndexType: '',
        currentDate: ''
      },
      rules: {
        IndexType: [{ required: true, message: '指标类别是必须的！', trigger: 'change' }],
        IndexName: [{ required: true, message: '指标名称是必须的！', trigger: 'blur' }],
        AlarmValue: [{ required: true, message: '指标预警值是必须的，默认值为0！', trigger: 'blur' }],
        Remark: [{ required: true, message: '指标含义是必须的！', trigger: 'blur' }],
        currentDate: [{ required: true, message: '时间是必须的！', trigger: 'blur' }]
      }
    }
  },
  filters: {
    mapCategory (IndexType) {
      let res = ''
      if (+IndexType === 0) {
        res = '未划分类别'
      } else if (+IndexType === 1) {
        res = '聚集程度指标'
      } else if (+IndexType === 2) {
        res = '开发强度指标'
      } else if (+IndexType === 3) {
        res = '空间分析指标'
      } else {
        res = '安全保障指标'
      }
      return res
    },
    dateFormat (date) {
      return date.slice(0, 10)
    }
  },
  directives: {
    waves
  },
  components: {
    Pagination
  },
  mounted () {
    this.$store.commit('global/alterMapVisual')
    this.getFactorList()
    this.getCategoryList()
    this.temp.currentDate = yymmdd()
    this.getTableHeight()
    window.addEventListener('resize', this.getTableHeight)
  },
  methods: {
    createData () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          createFactor(this.temp).then((res) => {
            if (res.code !== 1) {
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '指标创建成功',
                type: 'success',
                duration: 2000
              })
              this.handleFilter()
            }
          })
        }
      })
    },
    updateData (row) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          updateFactor(this.temp).then((res) => {
            if (res.code !== 1) {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '指标更新成功',
                type: 'success',
                duration: 2000
              })
              this.handleFilter()
            }
          })
        }
      })
    },
    wrapperKeyword (k, v) {
      function highlight (value) {
        return '<span style="color: #1890ff">' + value + '</span>'
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      }
    },
    handleFilter () {
      this.getFactorList()
    },
    handleCreate () {
      this.temp = {
        IndexName: '',
        Remark: '',
        AlarmValue: 0,
        IndexType: '',
        currentDate: this.temp.currentDate
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleDownload () {
      console.log('handleDownload')
    },
    handleUpdate (row) {
      row.currentDate = this.temp.currentDate
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久指标信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFactor(row.id).then(res => {
          if (res.code !== 1) {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          }
        })
      })
    },
    getCategoryList () {
      getCategory().then(res => {
        this.categoryList = res.data
      })
    },
    getFactorList () {
      this.listLoading = true
      // console.log(this.listQuery);
      fetchList(this.listQuery).then(response => {
        const { rows, count } = response.data
        this.list = rows
        // console.log(this.list)
        this.total = count
        // Just to simulate the time of the request
        this.list.forEach(item => {
          item.IndexNameWrapper = this.wrapperKeyword('IndexName', item.IndexName)
          item.RemarkWrapper = this.wrapperKeyword('Remark', item.Remark)
        })
        this.listLoading = false
      })
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    getTableHeight () {
      const fontSize = document.documentElement.style.fontSize.slice(0, -2)
      this.tableHeight = (window.innerHeight - 240 * 2 / 3) / fontSize + 'rem'
    }
  },
  async destroyed () {
    const res = await fetchList({
      from: 'home'
    })
    this.$store.commit('global/alterFactorList', res.data)
    this.$store.commit('global/alterMapVisual')
    window.removeEventListener('resize', this.getTableHeight)
  }
}
</script>

<style scoped>
.pagination-container {
  height: 50px;
  margin-bottom: 5px;
}
/*.el-table {*/
/*  height: calc(100vh - 230px);*/
/*}*/
</style>
